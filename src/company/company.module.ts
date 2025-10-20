import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  providers: [CompanyService, SupabaseService],
  controllers: [CompanyController]
})
export class CompanyModule {}
