import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService, SupabaseService]
})
export class RecipeModule {}
