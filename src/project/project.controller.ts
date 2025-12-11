import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { ProjectDTO, ProjectListResponseDto } from './project.dto';
import { ProjectService } from './project.service';
import { RoleGuard } from 'auth/role.guard.guard';
import { RequireRole } from 'common/common.decorator';

@Controller('api/project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

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
        example: 'resumes(id,name),tags(id,name)',
        description: 'Comma-separated list of relation fields. Example: resumes(id,name)'
    })
    async getDataProjects(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
        @Query('entities') entities: string = ''
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
    @ApiBody({ type: ProjectDTO, })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Numeric ID of the project to update',
        example: 123,
    })
    async updateProject(@Param() projectId: number, @Body() projectPayload: ProjectDTO) {
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
        description: 'Numeric Id of the project to Delete',
        example: 1,
    })
    async deleteProject(@Param() projectId: number) {
        return await this.projectService.deleteProjects(projectId);
    }
}
