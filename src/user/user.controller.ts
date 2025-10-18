import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { UserService } from './user.service';

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
}
