import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class CompanyService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getDataCompanies() {
        try {
            const {} = await this.supabaseService.getClient().from('companies').select("*");
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
