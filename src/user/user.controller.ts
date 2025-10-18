import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { UserService } from './user.service';
import { Profile } from 'auth/auth.service';
import { UserDTO } from './user.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.userService.getUsers(page, limit);
  }

  @Get('summaries')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserSummary() {
    return await this.userService.getSummary();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserMe(@Req() req: Request) {
    const profile = req['profile'] as Profile | null;

    if (profile === null) throw new Error('User not found');

    return await this.userService.getUserMe(profile?.id as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const profile = req['profile'] as Profile | null;

    if (profile === null) throw new Error('User not found');

    return await this.userService.deleteUserByAdmin(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() paylaod: UserDTO) {
    return this.userService.createUser(paylaod);
  }
}
