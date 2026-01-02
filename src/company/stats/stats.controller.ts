import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { RoleGuard } from 'auth/role.guard.guard';
import { RequireRole } from 'common/common.decorator';

@Controller('/api/companies/stats')
@UseGuards(AuthGuard,RoleGuard)
@RequireRole('superadmin')
export class CompanyStatsController {
    constructor(private readonly companyStatsService: StatsService) {}

    @Get('')
    @ApiBearerAuth()
    async getDataSummary() {
        return await this.companyStatsService.getSummary();
    }
}
