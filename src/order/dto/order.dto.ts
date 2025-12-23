// src/order/dto/order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDate } from 'class-validator';

export class OrderDto {
  @ApiProperty({
    description: 'Unique identifier of the order',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Timestamp when the order was created',
    example: '2024-06-01T10:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'User ID associated with the order (nullable)',
    example: 'u9v8w7x6-y5z4-3210-a9b8-c7d6e5f4g3h2',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId: string | null;

  @ApiProperty({
    description: 'Product ID associated with the order (nullable)',
    example: 'p1q2r3s4-t5u6-7890-v1w2-x3y4z5a6b7c8',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  productId: string | null;

  @ApiProperty({
    description: 'Company Id associated with the order',
    example: 'plsas-232xxx',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  companyId: string;

  @ApiProperty({
    description: 'Current status of the order',
    example: 'pending',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Source the order',
    example: 'website',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'Timestamp when the order was last updated (nullable)',
    example: '2024-06-02T11:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  updatedAt: Date | null;
}
