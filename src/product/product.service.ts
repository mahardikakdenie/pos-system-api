import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { CreateProductDTO } from './product.dto';

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

  async updateProduct(productPayload: CreateProductDTO, productId: string) {
    try {
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
