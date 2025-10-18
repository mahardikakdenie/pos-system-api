// src/auth/dto/login.dto.ts
import { IsEmail, isNotEmpty, IsNotEmpty, isString, IsString } from 'class-validator';

export class UserDTO {
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  role_id: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}
