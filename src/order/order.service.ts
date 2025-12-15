import { BadGatewayException, BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { ProfileDATA } from 'user/user.dto';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getDataOrders() {
        try {
            const query = this.supabaseService.getClient()
                .from('orders')
                .select('*');

            const { data, error } = await query;

            if (error) throw new BadRequestException({
                name: error.name,
                message: error.message,
            });

            return data;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async createOrders(user: ProfileDATA, orderPayload: OrderDto) {
        try {
            if (!user) throw new UnauthorizedException();
            const {data, error} = await this.supabaseService.getClient()
                .from('orders')
                .insert(orderPayload);

                if (error) throw new BadRequestException({
                    name: error.name,
                    message: error.message,
                });

                return data;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
