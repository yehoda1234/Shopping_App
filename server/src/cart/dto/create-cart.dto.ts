import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateCartDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;

}
