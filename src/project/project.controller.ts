import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'auth/auth.guard';
import { ProjectListResponseDto } from './project.dto';

@Controller('api/project')
export class ProjectController {

    @Get('')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ProjectListResponseDto })
    async getDataProjects() {
        return await this.getDataProjects();
    }
}
