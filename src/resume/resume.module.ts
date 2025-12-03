import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  providers: [ResumeService, SupabaseService],
  controllers: [ResumeController],
  imports: [],
})
export class ResumeModule {}
