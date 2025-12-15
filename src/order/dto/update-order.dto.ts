// src/order/dto/update-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class UpdateOrderDto {
    @ApiProperty({
        description: 'User ID associated with the order',
        example: 'u9v8w7x6-y5z4-3210-a9b8-c7d6e5f4g3h2',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiProperty({
        description: 'Product ID associated with the order',
        example: 'p1q2r3s4-t5u6-7890-v1w2-x3y4z5a6b7c8',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiProperty({
        description: 'Company ID associated with the order',
        example: 'p1q2r3s4-t5u6-7890-v1w2-x3y4z5a6b7c8',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    company_id?: string;

    @ApiProperty({
        description: 'Status of the new order',
        example: 'pending',
        required: false,
    })
    @IsString()
    @MaxLength(255)
    status: string;

    @ApiProperty({
        description: 'source of the new order',
        example: 'pos',
        required: false,
    })
    @IsString()
    @MaxLength(255)
    source: string;

    @ApiProperty({
        description: 'Documentation updated at for updated a new Order',
        example: 'timestamp',
        required: false,
    })
    @IsString()
    updated_at: string;
}
