import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  providers: [OrderService, SupabaseService],
  controllers: [OrderController]
})
export class OrderModule {}
