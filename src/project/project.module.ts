import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { SupabaseService } from 'supabase/supabase.service';
import { ProjectController } from './project.controller';

@Module({
  providers: [ProjectService, SupabaseService],
  controllers: [ProjectController]
})
export class ProjectModule {}
