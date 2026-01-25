


import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/entities/cart-item.entity';
import { UserRole } from '../users/entities/user.entity';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private dataSource: DataSource,
  ) {}

  async create(user: User, createOrderDto: CreateOrderDto) {
    const { shippingAddress, phone, comment } = createOrderDto;
console.log('Creating order for user ID:', user.id);
    // 1. שליפת העגלה
    const cart = await this.cartService.getCart(user);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('העגלה ריקה - אי אפשר ליצור הזמנה');
    }

    // 2. חישוב סכום כולל (לפני הטרנזקציה)
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    // 3. ביצוע הטרנזקציה
    return this.dataSource.transaction(async (manager) => {
      
      // א. יצירת ההזמנה (ללא פריטים כרגע - רק הכותרת)
      // אנחנו משתמשים ב-save כדי לקבל חזרה את ה-ID שנוצר
      const order = manager.create(Order, {
        user: { id: user.id } as any, // מצביע למשתמש
        status: OrderStatus.PENDING,
        shippingAddress,
        phone,
        comment,
        totalAmount,
      });
      
      const savedOrder = await manager.save(Order, order);

      
      const orderItems: OrderItem[] = [];
      for (const cartItem of cart.items) {
        const product = cartItem.product;

        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(
            `המוצר "${product.name}" חסר במלאי. נותרו רק ${product.stock} יחידות.`
          );
        }
        product.stock -= cartItem.quantity;
        await manager.save(product);

        const orderItem = manager.create(OrderItem, {
          order: { id: savedOrder.id } as any,
          product: { id: product.id } as any,
          quantity: cartItem.quantity,
          priceAtPurchase: product.price,
        });
        orderItems.push(orderItem);
      }


      
      await manager.save(OrderItem, orderItems);

      // ד. מחיקת העגלה
      await manager.delete(CartItem, { cart: { id: cart.id } });

      // ה. החזרת תוצאה יפה (מרכיבים ידנית את התשובה)
      return {
        ...savedOrder,
        items: orderItems,
        message: 'ההזמנה נוצרה בהצלחה',
      };
    });
  }


 async findAll(user: User) {
      return this.ordersRepository.find({
        where: { user: { id: user.id } } ,
        relations: ['items', 'items.product'], // כולל פרטי המשתמש שהזמין
        order: { createdAt: 'DESC' },
      });
    }

    async findAllByAdmin() {
      return this.ordersRepository.find({
        relations: ['items', 'items.product', 'user'],
        order: { createdAt: 'DESC' },
      });
    }



  async findOne(id: number, user: User) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`הזמנה ${id} לא נמצאה`);
    return order;
  }

  async updateStatus(id: number, status: OrderStatus,) {
    const order = await this.ordersRepository.findOneBy({ id });

    if (!order)
      throw new NotFoundException(`הזמנה ${id} לא נמצאה`);

    order.status = status;
    return this.ordersRepository.save(order);
  }
}

