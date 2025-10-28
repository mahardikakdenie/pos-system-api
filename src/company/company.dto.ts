import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CompanyDTO {
    @IsString()
    @ApiProperty({example: 'PTDONATMERDERKA'})
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    account_url: string;

    @IsString()
    @IsNotEmpty()
    status: string;
}
