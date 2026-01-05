import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    user: User;


    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}
