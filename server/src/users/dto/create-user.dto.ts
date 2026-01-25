import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {

    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    // בודק שיש לפחות אות אחת באנגלית (גדולה או קטנה)
  @Matches(/[a-zA-Z]/, { message: 'הסיסמה חייבת להכיל לפחות אות אחת באנגלית' })
  // בודק שיש לפחות תו מיוחד אחד (נקודה, פסיק, סימן קריאה וכו')
  @Matches(/[.,!@#$%^&*?_~-]/, { message: 'הסיסמה חייבת להכיל לפחות תו מיוחד אחד (.,!@#)' })
    password: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'Invalid role' })
    role?: UserRole;
}
