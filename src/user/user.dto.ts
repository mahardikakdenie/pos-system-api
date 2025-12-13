// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, isString, IsString, IsUUID } from 'class-validator';

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

  @IsString()
  @ApiProperty({ example: 'string' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'string' })
  username: string;

  @IsString()
  @ApiProperty({ example: 'string' })
  avatar: string;
}
export class ProfileDTO {
  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  role_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string' })
  avatar: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({example: 'uuid'})
  company_id: string;
}
export class ProfileDATA {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  role_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string' })
  avatar: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({example: 'uuid'})
  company_id: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}

export class ProfileResponse {
  @ApiProperty({ example: '287d7a48-75cf-4aab-8512-2ba8e5be8aaf' })
  id: string;

  @ApiProperty({ example: 'superadmin@yopmail.com' })
  email: string;
}
