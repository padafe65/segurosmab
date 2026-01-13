import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  asunto: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  mensaje: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id?: number; // Opcional: si el usuario está logueado
}
