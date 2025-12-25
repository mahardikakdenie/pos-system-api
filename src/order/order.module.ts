import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SupabaseService } from 'supabase/supabase.service';
import { TenantService } from './tenant/tenant.service';

@Module({
  providers: [OrderService, SupabaseService, TenantService],
  controllers: [OrderController]
})
export class OrderModule {}
