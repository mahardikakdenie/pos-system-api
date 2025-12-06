import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { ProjectDTO, ProjectListResponseDto } from './project.dto';
import { ProjectService } from './project.service';

@Controller('api/project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

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
    @ApiOkResponse({type: ProjectListResponseDto})
    @ApiBody({ type: ProjectDTO })
    async createProject(@Body() projectPayload: ProjectDTO) {
        return await this.projectService.createProject(projectPayload);
    }
}
