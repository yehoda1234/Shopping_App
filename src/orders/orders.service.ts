// import { Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import { Order } from './entities/order.entity';
// import { OrderItem } from './entities/order-item.entity';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
// import { User } from 'src/users/entities/user.entity';
// import { CartService } from 'src/cart/cart.service';
// import { OrderStatus } from './entities/order.entity';
// import { CartItem } from 'src/cart/entities/cart-item.entity';

// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectRepository(Order)
//     private ordersRepository: Repository<Order>,
//     @InjectRepository(OrderItem)
//     private orderItemRepository: Repository<OrderItem>,
//     private cartService: CartService,
//     private dataSource: DataSource,
//   ) {}

// async create(user: User, createOrderDto: CreateOrderDto) {
//   const { shippingAddress, phone, comment } = createOrderDto;


//   const cart = await this.cartService.getCart(user);
//   if (!cart || !cart.items ||cart.items.length === 0) {
//     throw new BadRequestException('Cart is empty');
//   }

//   return this.dataSource.transaction(async (manager) => {

//     const orderItem = cart.items.map((cartItem) => {
//       return manager.create(OrderItem, {
//         quantity: cartItem.quantity,
//         priceAtPurchase: cartItem.product.price,
//         product: { id: cartItem.product.id } as any,
//       });
//     });

//     const totalAmount = cart.items.reduce((sum, item) => {
//       return sum + (item.product.price * item.quantity);
//     }, 0);

//     const order = manager.create(Order, {
//       user: { id: user.id } as any,
//       status: OrderStatus.PENDING,
//       shippingAddress: shippingAddress,
//       phone,
//       comment,
//       totalAmount,
//       items: orderItem,
//     });

//     const savedOrder =  await manager.save(Order, order);

//     await manager.delete(CartItem, { cart: { id: cart.id } });

//     return savedOrder;
//   });
// }

  
// async findAll(user: User) {
//     return this.ordersRepository.find({
//       where: { user: { id: user.id } },
//       relations: ['items', 'items.product'],
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async findOne(id: number, user: User) {
//     const order = await this.ordersRepository.findOne({
//       where: { id, user: { id: user.id } },
//       relations: ['items', 'items.product'],
//     });

//     if (!order) {
//       throw new NotFoundException(`Order with ID ${id} not found`);
//     }

//     return order;  }


//   }



import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderStatus } from './entities/order.entity';

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

    const cart = await this.cartService.getCart(user);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('העגלה ריקה - אי אפשר ליצור הזמנה');
    }

    return this.dataSource.transaction(async (manager) => {
      const orderItems = cart.items.map((cartItem) => {
        return manager.create(OrderItem, {
          quantity: cartItem.quantity,
          priceAtPurchase: cartItem.product.price,
          product: cartItem.product,
        });
      });

      const totalAmount = orderItems.reduce((sum, item) => {
        return sum + item.priceAtPurchase * item.quantity;
      }, 0);

      const order = manager.create(Order, {
        user: { id: user.id } as Partial<User>,
        status: OrderStatus.PENDING,
        shippingAddress,
        phone,
        comment,
        totalAmount,
        items: orderItems,
      });

      const savedOrder = await manager.save(Order, order);
      await this.cartService.clearCart(user);

      return savedOrder;
    });
  }

  async findAll(user: User) {
    return this.ordersRepository.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: User) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`הזמנה מספר ${id} לא נמצאה`);
    }

    return order;
  }
}


