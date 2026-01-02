import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { SupabaseService } from 'supabase/supabase.service';
import { StatsService } from './stats/stats.service';
import { CompanyStatsController } from './stats/stats.controller';

@Module({
  providers: [CompanyService, SupabaseService, StatsService],
  controllers: [CompanyController, CompanyStatsController]
})
export class CompanyModule {}
