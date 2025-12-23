import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { ProfileDATA } from 'user/user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { mergeWithExisting } from 'common/utils/merge-with-existing';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

@Injectable()
export class OrderService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataOrders() {
    try {
      const query = this.supabaseService.getClient().from('orders').select('*');

      const { data, error }: PostgrestResponse<Record<string, string>> =
        await query;

      if (error)
        throw new BadRequestException({
          name: error.name,
          message: error.message,
        });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getDetailOrders(orderId: string) {
    try {
      const { data, error }: PostgrestResponse<Record<string, string>> =
        await this.supabaseService
          .getClient()
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

      if (error)
        throw new BadRequestException({
          name: error.name,
          message: error.message,
        });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async createOrders(user: ProfileDATA, orderPayload: CreateOrderDto) {
    try {
      if (!user) throw new UnauthorizedException();
      const { data, error } = await this.supabaseService
        .getClient()
        .from('orders')
        .insert(orderPayload);

      if (error)
        throw new BadRequestException({
          name: error.name,
          message: error.message,
        });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async updateOrders(
    user: ProfileDATA,
    orderPayload: UpdateOrderDto,
    orderId: string,
  ) {
    try {
      if (!user) throw new UnauthorizedException();
      const mergedData = await mergeWithExisting(
        orderPayload as Partial<UpdateOrderDto>,
        {
          profileFields: [],
          fetchExistingData: async (
            fields: string[],
          ): Promise<Record<string, string> | null> => {
            const {
              data,
              error,
            }: PostgrestSingleResponse<Record<string, string>> =
              await this.supabaseService
                .getClient()
                .from('orders')
                .select(fields.join(','))
                .eq('id', orderId)
                .single();

            if (error)
              throw new BadRequestException({
                name: error.name,
                message: error.message,
              });

            return data;
          },
        },
      );
      const { data, error }: PostgrestResponse<Record<string, string>> =
        await this.supabaseService
          .getClient()
          .from('orders')
          .upsert({ id: orderId, ...mergedData })
          .select('*');

      if (error)
        throw new BadGatewayException({
          name: error.name,
          message: error.message,
        });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
