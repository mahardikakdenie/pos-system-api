import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { SupabaseService } from 'supabase/supabase.service';
import { ProjectController } from './project.controller';
import { SkillService } from './skill/skill.service';
import { SkillController } from './skill/skill.controller';

@Module({
  providers: [ProjectService, SupabaseService, SkillService],
  controllers: [ProjectController, SkillController]
})
export class ProjectModule {}
