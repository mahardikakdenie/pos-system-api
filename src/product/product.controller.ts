import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'auth/auth.guard';

@Controller('/api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getData() {
        return await this.productService.getDataProducts();
    }
}
