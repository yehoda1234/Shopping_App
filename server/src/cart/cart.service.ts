import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

  ){}

  async getCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user});
      await this.cartRepository.save(cart);
      cart.items = [];
    }
    return cart;
  }

  async addToCart(user: User, createCartDto: CreateCartDto){
    const { productId, quantity } = createCartDto;
    const cart = await this.getCart(user);


    const existingItem = cart.items.find((item) => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      return await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart: cart,
        product: { id: productId } as any,
        quantity: quantity,
      });
      return await this.cartItemRepository.save(newItem);
    }
  }

  async removeItem(itemId: number) {
    const result = await this.cartItemRepository.delete(itemId);
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }
    return { message: `Cart item with ID ${itemId} has been removed` };
  }

  async clearCart(user: User) {
    const cart = await this.getCart(user);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    return { message: 'Cart has been cleared' };
  }


  async updateItemQuantity(user: any,itemId: number, quantity: number) {
    await this.cartItemRepository.update(itemId, { quantity });
    return this.getCart(user);
  
  }

}