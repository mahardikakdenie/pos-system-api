import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { ProjectDTO, ProjectListResponseDto } from './project.dto';
import { ProjectService } from './project.service';
import { RoleGuard } from 'auth/role.guard.guard';
import { RequireRole } from 'common/common.decorator';
import { RequireProfile } from 'common/decorator/require-profile.decorator';

@Controller('api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  @UseGuards(AuthGuard, RoleGuard)
  @RequireRole('admin', 'superadmin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProjectListResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'entities',
    required: false,
    type: String,
    example: 'resumes(id,name)',
    description: 'Comma-separated list of relation fields. Example: resumes(id,name)',
  })
  async getDataProjects(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('entities') entities: string = '',
  ) {
    return await this.projectService.getDataProjects(page, limit, entities);
  }

  @Post('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ProjectListResponseDto })
  @ApiBody({ type: ProjectDTO })
  async createProject(@Body() projectPayload: ProjectDTO) {
    return await this.projectService.createProject(projectPayload);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProjectListResponseDto })
  @ApiBody({ type: ProjectDTO })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Numeric ID of the project to update',
    example: 123,
  })
  async updateProject(
    @Param('id') projectId: number,
    @Body() projectPayload: ProjectDTO,
  ) {
    return await this.projectService.updateProjects(projectPayload, projectId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProjectListResponseDto })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Numeric ID of the project to delete',
    example: 1,
  })
  async deleteProject(@Param('id') projectId: number) {
    return await this.projectService.deleteProjects(projectId);
  }

  @Get('my-projects')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProjectListResponseDto })
  @ApiQuery({
    name: 'entities',
    required: false,
    type: String,
    example: 'resumes(id,name,profiles(id))',
    description: 'Comma-separated relation fields. Example: resumes(id,name,profiles(id))',
  })
  async getDataMyProjects(
    @RequireProfile() profile: any,
    @Query('entities') entities: string = '',
  ) {
    return await this.projectService.getMyProjects(profile, entities);
  }
}
