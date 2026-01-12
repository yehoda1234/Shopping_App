import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description?: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
