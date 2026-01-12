import { IsString, IsOptional, IsNotEmpty } from 'class-validator';



export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

}
