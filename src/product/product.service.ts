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

  async updateProduct(
    productPayload: UpdateProduct,
    productId: string,
    profile: Profile,
  ) {
    try {
      const {
        data: product,
        error: errorDetail,
      }: PostgrestSingleResponse<UpdateProduct> = await this.supabaseService
        .getClient()
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (errorDetail)
        throw new BadGatewayException({ message: errorDetail.message });

      if (product) {
        productPayload.logs = product.logs;

        productPayload?.logs?.data.push({
          name: 'Update',
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

async getSummaryProducts(): Promise<{
  all: number;
  active: number;
  inactive: number;
  suspend: number;
}> {
  const client = this.supabaseService.getClient();

  try {
    // Hitung total
    const { count: allCount, error: allError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (allError) throw new BadGatewayException(allError.message);

    // Hitung active
    const { count: activeCount, error: activeError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (activeError) throw new BadGatewayException(activeError.message);

    // Hitung inactive
    const { count: inactiveCount, error: inactiveError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'inactive');

    if (inactiveError) throw new BadGatewayException(inactiveError.message);

    // Hitung suspend
    const { count: suspendCount, error: suspendError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'suspend');

    if (suspendError) throw new BadGatewayException(suspendError.message);

    return {
      all: allCount ?? 0,
      active: activeCount ?? 0,
      inactive: inactiveCount ?? 0,
      suspend: suspendCount ?? 0,
    };
  } catch (error) {
    throw new BadGatewayException(error);
  }
}

  generateSlug = (input: string): string => {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };
}
