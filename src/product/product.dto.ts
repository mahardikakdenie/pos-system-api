// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({example: 'Wireless Headphones'})
  @IsNotEmpty({ message: 'Email wajib diisi' })
  name: string;

  @IsString()
  @ApiProperty({example: 'High-quality wireless headphones with noise cancellation.'})
  @IsNotEmpty({ message: 'Description wajib diisi' })
  description: string;

  @IsString()
  @ApiProperty({example: 'wireless-headphones'})
  @IsNotEmpty({ message: 'Image wajib diisi' })
  image: string;

  @IsString()
  @ApiProperty({example: '89.99'})
  @IsNotEmpty({message: "Price is required"})
  price: string;

  @IsEnum(UserStatus, {
    message: 'Status harus salah satu dari: active, inactive, suspend',
  })
  @ApiProperty({example: 'inactive'})
  @IsNotEmpty({ message: 'Status wajib diisi' })
  status: UserStatus;
  
  @IsObject({ message: 'Logs harus berupa objek JSON' })
  @ApiProperty({example: { createdBy: 'admin', createdAt: '2025-04-01T10:00:00Z' }})
  @IsNotEmpty({ message: 'Logs wajib diisi' })
  logs: Record<string, any>;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  slug: string;
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
