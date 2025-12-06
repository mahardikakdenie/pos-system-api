import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { RecipeDTO } from './recipe.dto';

@Injectable()
export class RecipeService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getDataRecipe() {
        try {
            const { data, error } = await this.supabaseService.getClient()
                .from('recipes')
                .select('*');

            if (error) {
                throw new BadGatewayException({
                    message: error.message,
                    name: error.name || 'UnknownError',
                })
            }

            return data;
        } catch (error) {
            throw new BadGatewayException({
                message: error.message,
                name: error.name || 'UnknownError',
            })
        }
    }

    async createRecipe(recipePayload: RecipeDTO) {
        try {
            const {data, error} = await this.supabaseService.getClient()
            .from('recipes')
            .insert(recipePayload)
            .select('*');

            if (error) {
                throw new BadGatewayException({
                    message: error.message,
                    name: error.name || 'UnknownError',
                });
            }

            return data;
        } catch (error) {
            throw new BadGatewayException({
                message: error.message,
                name: error.name || 'UnknownError',
            })
        }
    }
}
