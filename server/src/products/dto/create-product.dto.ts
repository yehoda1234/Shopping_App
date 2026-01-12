import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    categoryId?: number;
}
