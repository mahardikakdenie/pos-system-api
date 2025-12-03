import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ResumeDTO, ResumeListResponse, ResumeItemResponse } from './resume.dto';
import { RequireProfile } from 'common/decorator/require-profile.decorator';
import type { Profile } from 'common/types/profile.type';

@Controller('api/resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all resumes of the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved resumes',
    type: ResumeListResponse,
  })
  async getData() {
    return await this.resumeService.getDataResume();
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: ResumeDTO })
  @ApiOperation({ summary: 'Create a new resume' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Resume created successfully',
    type: ResumeItemResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  async createResume(
    @Body() payload: ResumeDTO,
    @RequireProfile() profile: Profile,
  ) {
    return await this.resumeService.createResume(payload, profile);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing resume' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Resume ID to update',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resume updated successfully',
    type: ResumeItemResponse,
  })
  @HttpCode(HttpStatus.OK)
  async updateResume(
    @Param('id', ParseIntPipe) resumeId: number,
    @Body() resumePayload: ResumeDTO,
  ) {
    return await this.resumeService.updateResume(resumePayload, resumeId);
  }
}
