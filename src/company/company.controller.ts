import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyDTO } from './company.dto';

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

    @Post('')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new company data' })
    @ApiBody({ type: CompanyDTO })
    async createCompany(@Body() companyPayload: CompanyDTO) {
        return await this.companyService.createCompanyData(companyPayload);
    }
}
