import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RoleDTO {
    @ApiProperty({
        example: 'superadmin',
        description: 'Unique name of the role',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'superadmin',
        description: 'Description of the role responsibilities or purpose',
    })
    @IsString()
    descriptions: string;
}
