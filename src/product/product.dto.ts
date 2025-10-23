// src/auth/dto/login.dto.ts
import {
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsObject,
  IsOptional,
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
  logs: Record<string, any>;
}

export class UpdateProduct {
  @IsString()
  @IsOptional({ message: 'Email wajib diisi' })
  name: string;

  @IsString()
  @IsOptional({ message: 'Description wajib diisi' })
  description: string;

  @IsString()
  @IsOptional({ message: 'Description wajib diisi' })
  slug: string;

  @IsString()
  @IsOptional({ message: 'Image wajib diisi' })
  image: string;

  @IsString()
  @IsOptional({message: "Price is required"})
  price: string;

  @IsEnum(UserStatus, {
    message: 'Status harus salah satu dari: active, inactive, suspend',
  })
  @IsOptional({ message: 'Status wajib diisi' })
  status: UserStatus;
  
  @IsObject({ message: 'Logs harus berupa objek JSON' })
  @IsOptional({ message: 'Logs wajib diisi' })
  logs: Record<string, any>;
}
