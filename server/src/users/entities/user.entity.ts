import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity( 'users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'varchar',select: false, nullable: true})
    @Exclude()
    password: string | null;


    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    googleId: string;

    @Column({ default: 'local'})
    provider: string;


    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relations
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart;
}
