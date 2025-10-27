// src/product/product.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'auth/auth.guard';
import { CreateProductDTO, UpdateProduct } from './product.dto';
import { RequireProfile } from 'common/decorator/require-profile.decorator';
import type { Profile } from 'common/types/profile.type';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('/api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    schema: {
      example: {
         data: [
          {
            id: 'prod_01',
            name: 'Wireless Headphones',
            price: 89.99,
            stock: 25,
            created_at: '2025-04-01T10:00:00Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.productService.getDataProducts();
  }

  @Get('/stats/summary')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product summary statistics' })
  @ApiResponse({
    status: 200,
    description: 'Summary retrieved successfully',
    schema: {
      example: {
        totalProducts: 42,
        totalInStock: 380,
        outOfStockCount: 3,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async getSummaryData() {
    return await this.productService.getSummaryProducts();
  }

  @Post('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDTO })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      example: {
        id: 'prod_02',
        name: 'Mechanical Keyboard',
        price: 120.0,
        stock: 15,
        created_at: '2025-04-05T14:30:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() payload: CreateProductDTO) {
    return await this.productService.createProduct(payload);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique product identifier',
    example: 'prod_01',
  })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    schema: {
      example: {
        id: 'prod_01',
        name: 'Wireless Headphones',
        price: 89.99,
        stock: 25,
        created_at: '2025-04-01T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') productId: string) {
    return await this.productService.getProductById(productId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID to update',
    example: 'prod_01',
  })
  @ApiBody({ type: UpdateProduct })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      example: {
        id: 'prod_01',
        name: 'Wireless Headphones Pro',
        price: 99.99,
        stock: 20,
        updated_at: '2025-04-06T09:15:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') productId: string,
    @Body() payload: UpdateProduct,
    @RequireProfile() profile: Profile,
  ) {
    return await this.productService.updateProduct(payload, productId, profile);
  }
}
