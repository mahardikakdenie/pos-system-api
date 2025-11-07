import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CompanyDTO {
    @IsString()
    @ApiProperty({example: 'PTDONATMERDERKA'})
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: ''})
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
