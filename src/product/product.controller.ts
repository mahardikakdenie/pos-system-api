import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'auth/auth.guard';
import { CreateProductDTO, UpdateProduct } from './product.dto';
import { RequireProfile } from 'common/decorator/require-profile.decorator';
import type { Profile } from 'common/types/profile.type';

@Controller('/api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getData() {
        return await this.productService.getDataProducts();
    }

    @Get('/stasts/summary')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getSummaryData() {
        return await this.productService.getSummaryProducts();
    }

    @Post('')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProduct(@Body() payload: CreateProductDTO) {
        return await this.productService.createProduct(payload);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getProductById(@Param("id") productId: string) {
        return await this.productService.getProductById(productId);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateProduct(@Param("id") productId: string, @Body() payload: UpdateProduct, @RequireProfile() profile: Profile) {
        return await this.productService.updateProduct(payload, productId, profile);
    }
}
