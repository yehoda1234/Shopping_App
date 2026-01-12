import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Category } from 'src/categories/entities/category.entity';


@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true, type: 'text' })
    description?: string;

    @Column('int', { default: 0 })
    stock: number;

    @Column('text', { nullable: true })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @ManyToOne(() => Category, (category) => category.products, { 
        eager: true,
        onDelete: 'SET NULL' 
    })
    category: Category;

}