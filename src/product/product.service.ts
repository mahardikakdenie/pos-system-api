import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { CreateProductDTO } from './product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly supabaseService:SupabaseService) {}

    async getDataProducts() {
        try {
            const {data, error} = await this.supabaseService.getClient().from('products').select('*');

            if (error) {
                throw new BadGatewayException({message: error.message, name: error.name});
            }

            return data
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async createProduct(productPayload: CreateProductDTO) {
        try {
            const {data, error} = await this.supabaseService.getClient().from('products').insert(productPayload);

            if (error) {
                console.log("error :", error.message);
                
                throw new BadGatewayException({message: error.message, name: error.name});
            }

            return {
                data,
            }
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
