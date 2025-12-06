import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { RecipeDTO } from './recipe.dto';
import { RecipeService } from './recipe.service';
import { AuthGuard } from 'auth/auth.guard';

@Controller('/api/recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}
    
    @Get('')
    @ApiOkResponse({
        type: RecipeDTO
    })
    @UseGuards(AuthGuard)
    async getData() {
        return this.recipeService.getDataRecipe();
    }
}
