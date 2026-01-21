import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { RoleGuard } from 'auth/role.guard.guard';
import { RequireRole } from 'common/common.decorator';

@ApiTags('Companies Statistics')
@Controller('/api/companies/stats')
@UseGuards(AuthGuard, RoleGuard)
export class CompanyStatsController {
    constructor(private readonly companyStatsService: StatsService) {}

    @Get('')
    @RequireRole('superadmin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get dynamic companies summary with percentage growth' })
    @ApiQuery({ name: 'days', required: false, type: Number, description: 'Range days to compare (default 7)' })
    @ApiResponse({ status: 200, description: 'Growth statistics retrieved successfully' })
    async getDataSummary(@Query('days') days?: number) {
        return await this.companyStatsService.getSummary(days ? Number(days) : 7);
    }
}
