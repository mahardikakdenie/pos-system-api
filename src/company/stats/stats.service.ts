import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class StatsService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getSummary() {
        try {
            const {count, error: countError} = await this.supabaseService.getClient().from('companies')
                .select("*", {count: 'exact'});

                return {
                    count,
                };
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
