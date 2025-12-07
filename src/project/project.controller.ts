import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { ProjectDTO, ProjectListResponseDto } from './project.dto';
import { ProjectService } from './project.service';

@Controller('api/project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Get('')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ProjectListResponseDto })
    async getDataProjects() {
        return await this.projectService.getDataProjects();
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
