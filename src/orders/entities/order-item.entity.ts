import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceAtPurchase: number;

    // Relations
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, { eager: true })
    product: Product;
}

