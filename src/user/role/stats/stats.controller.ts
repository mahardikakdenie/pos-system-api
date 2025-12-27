import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleStatsService } from './stats.service';
import { AuthGuard } from 'auth/auth.guard';
import { RoleGuard } from 'auth/role.guard.guard';
import { RequireRole } from 'common/common.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('/api/user/role/stats')
@ApiTags('User Role Statistic')
export class RoleStatsController {
    constructor(private readonly roleStatsService: RoleStatsService) {}

    @Get('')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get user role statistics',
    })
    @ApiOkResponse({
        description: 'Succesfully retrieved user role data statistic',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Success' },
                total: { type: 'number', example: 2 },
                data: {
                    example: {
                        all: { type: 'number', example: 6 },
                    },
                },
            }
        }
    })
    @UseGuards(AuthGuard, RoleGuard)
    @RequireRole('superadmin')
    async getSummary() {
        return await this.roleStatsService.getDataSummary();
    }
}
