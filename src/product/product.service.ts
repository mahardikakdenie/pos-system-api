import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { CreateProductDTO, UpdateProduct } from './product.dto';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Profile } from 'common/types/profile.type';

@Injectable()
export class ProductService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataProducts() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('products')
        .select('*');

      if (error) {
        throw new BadGatewayException({
          message: error.message,
          name: error.name,
        });
      }

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async createProduct(productPayload: CreateProductDTO) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('products')
        .insert({
          ...productPayload,
          slug: this.generateSlug(productPayload.name),
        });

      if (error) {
        throw new BadGatewayException({
          message: error.message,
          name: error.name,
        });
      }

      return {
        data,
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async updateProduct(productPayload: UpdateProduct, productId: string, profile: Profile) {
    try {
      const { data: product, error: errorDetail }: PostgrestSingleResponse<UpdateProduct> = await this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

        if (errorDetail) throw new BadGatewayException({ message: errorDetail.message });

        if (product) {
          productPayload.logs = product.logs;

          productPayload?.logs?.data.push({
            name: "Update",
            message: `Update By : ${profile.email}`,
          });

          productPayload.slug = this.generateSlug(productPayload.name);
        }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('products')
        .update(productPayload)
        .eq('id', productId)
        .select('*');

      if (error) throw new BadGatewayException({ message: error.message });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getProductById(productId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('id', productId);

      if (error) throw new BadRequestException({ message: error.message });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  generateSlug = (input: string): string => {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };
}
