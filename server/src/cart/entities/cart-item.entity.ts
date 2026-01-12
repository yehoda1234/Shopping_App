import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';


@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { default: 1 })
    quantity: number;


    // Relations
    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Product,)
    @JoinColumn()
    product: Product;
}