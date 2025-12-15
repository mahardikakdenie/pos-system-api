import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SupabaseService } from 'supabase/supabase.service';
import { MailerService } from 'mailer/mailer.service';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { StatsService } from './stats/stats.service';
import { StatsController } from './stats/stats.controller';

@Module({
  providers: [UserService, SupabaseService, MailerService, RoleService, StatsService],
  controllers: [UserController, RoleController, StatsController],
})
export class UserModule {}
