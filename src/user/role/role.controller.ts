import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { Get, Query, Controller, UseGuards } from '@nestjs/common';

import { RoleService } from './role.service';
import { AuthGuard } from 'auth/auth.guard';
import { RoleGuard } from 'auth/role.guard.guard';

@Controller('api/user/role')
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated and filtered roles' })
  @ApiOkResponse({
    description: 'Successfully retrieved roles data.',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'Admin',
            description: 'Full system access',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 100,
          totalPages: 10,
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term to filter roles by name or description',
    example: '',
  })
  @ApiQuery({
    name: 'entities',
    required: false,
    type: String,
    description: 'Comma-separated list of entity IDs to filter by',
    example: '',
  })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    description: 'Field to sort by (e.g., name, created_at)',
    example: 'name',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'asc',
  })
  async getData(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('entities') entities?: string,
    @Query('order_by') orderBy?: string,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ) {
    return await this.roleService.getData(page, limit, entities, search, orderBy, sort);
  }
}
