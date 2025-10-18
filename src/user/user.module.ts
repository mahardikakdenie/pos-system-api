import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SupabaseService } from 'supabase/supabase.service';
import { MailerService } from 'mailer/mailer.service';

@Module({
  providers: [UserService, SupabaseService, MailerService],
  controllers: [UserController],
})
export class UserModule {}
