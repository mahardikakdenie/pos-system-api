import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CompanyDTO {
    @IsString()
    @ApiProperty({example: 'PTDONATMERDERKA'})
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'ptdonat@donat.co'})
    email: string;

    @IsString()
    @ApiProperty({example: 'pt-donat-merderka'})
    @IsNotEmpty()
    slug: string;

    @IsString()
    @ApiProperty({example: 'https://pt-donat-merderka.com'})
    @IsNotEmpty()
    account_url: string;

    @IsString()
    @ApiProperty({example: 'requested'})
    @IsNotEmpty()
    status: string;
}
export class CompanySummaryResponseDto {
    @ApiProperty({ example: 150 })
    total: number;

    @ApiProperty({ example: 120 })
    active: number;

    @ApiProperty({ example: 30 })
    inactive: number;

    @ApiProperty({ example: '2024-05-20T10:00:00.000Z' })
    updatedAt: string;
}
