import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from 'auth/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/user/stats')
@UseGuards(AuthGuard)
@ApiTags('User Statistic')
export class StatsController {
    constructor(private readonly userStatService: StatsService) { }

    @Get('')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user statistics grouped by role' })
    @ApiOkResponse({
        description: 'Successfully retrieved role-based user statistics',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Success' },
                total: { type: 'number', example: 2 },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'superadmin' },
                            count: { type: 'number', example: 6 },
                        },
                    },
                },
            },
        },
    })
    async getDataStats() {
        return await this.userStatService.getSummaries();
    }
}
