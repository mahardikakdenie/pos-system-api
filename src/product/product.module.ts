import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  providers: [ProductService, SupabaseService],
  controllers: [ProductController]
})
export class ProductModule {}
