import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { ColumnNumericTransformer } from "src/common/transformers/column-numeric.transformer";

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

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: new ColumnNumericTransformer() })
    totalAmount: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    shippingAddress: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    comment?: string;


    // Relations
    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    user: User;


    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}
