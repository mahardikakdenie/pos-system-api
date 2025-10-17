import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  providers: [UserService, SupabaseService],
  controllers: [UserController],
})
export class UserModule {}
