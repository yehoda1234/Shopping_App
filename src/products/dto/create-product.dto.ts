import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


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

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    @Min(0)
    stock: number;
}
