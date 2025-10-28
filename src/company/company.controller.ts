import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';

@ApiTags('Company')
@Controller('/api/company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get('')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all companies data' })
    async getDataCompany() {
        return await this.companyService.getDataCompanies();
    }
}
