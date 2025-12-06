import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
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
    @HttpCode(HttpStatus.OK)
    async getData() {
        return this.recipeService.getDataRecipe();
    }

    @Post('')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: AuthGuard })
    @ApiOkResponse({ type: RecipeDTO })
    async createRecipe(@Body() recipePayload: RecipeDTO) {
        return this.recipeService.createRecipe(recipePayload);
    }
}
