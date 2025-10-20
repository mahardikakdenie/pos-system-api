// src/auth/dto/login.dto.ts
import {
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsObject,
  isString,
  IsString,
} from 'class-validator';

// user-status.enum.ts
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPEND = 'suspend',
}

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty({ message: 'Email wajib diisi' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description wajib diisi' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Image wajib diisi' })
  image: string;

  @IsString()
  @IsNotEmpty({message: "Price is required"})
  price: string;

  @IsEnum(UserStatus, {
    message: 'Status harus salah satu dari: active, inactive, suspend',
  })
  @IsNotEmpty({ message: 'Status wajib diisi' })
  status: UserStatus;
  
  @IsObject({ message: 'Logs harus berupa objek JSON' })
  @IsNotEmpty({ message: 'Logs wajib diisi' })
  logs: Record<string, any>; // atau ganti dengan interface spesifik
}
