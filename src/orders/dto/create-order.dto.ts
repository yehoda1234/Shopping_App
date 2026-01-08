import { IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    comment?: string;



}
