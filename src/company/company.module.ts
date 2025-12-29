import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { SupabaseService } from 'supabase/supabase.service';
import { StatsService } from './stats/stats.service';

@Module({
  providers: [CompanyService, SupabaseService, StatsService],
  controllers: [CompanyController]
})
export class CompanyModule {}
