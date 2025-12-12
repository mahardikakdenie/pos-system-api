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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { UserService } from './user.service';
import { Profile } from 'auth/auth.service';
import { ProfileDTO, UserDTO } from './user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated list of users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      example: {
        data: [
          { id: '1', email: 'user1@example.com', name: 'User One' },
        ],
        meta: {
          status: 200,
          message: "Success"
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (not admin)' })
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.userService.getUsers(page, limit);
  }

  @Get('summaries')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user summary statistics (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Summary retrieved successfully',
    schema: { example: { totalUsers: 42 } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  async getUserSummary() {
    return await this.userService.getSummary();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserDTO,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async getUserMe(@Req() req: Request) {
    const profile = req['profile'] as Profile | null;
    if (profile === null) throw new Error('User not found');
    return await this.userService.getUserMe(profile.id as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '123' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const profile = req['profile'] as Profile | null;
    if (profile === null) throw new Error('User not found');
    return await this.userService.deleteUserByAdmin(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiBody({ type: UserDTO })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() payload: UserDTO) {
    return this.userService.createUser(payload);
  }

  @Put('update/profile/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiBody({type: UserDTO})
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  async updateUserProfile(@Body() profilePayload: ProfileDTO, @Param('id') userId: string) {
    return await this.userService.updateUserProfile(profilePayload, userId);
  }
}
