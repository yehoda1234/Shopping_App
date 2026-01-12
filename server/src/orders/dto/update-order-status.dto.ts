import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus) // מוודא שזה אחד מהסטטוסים החוקיים שלנו
  status: OrderStatus;
}