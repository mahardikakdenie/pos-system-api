import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class CompanyService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getDataCompanies() {
        try {
            const { data, error } = await this.supabaseService.getClient().from('companies').select("*");

            if (error) throw new BadGatewayException({message: error.message});

            return data;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
