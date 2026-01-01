import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class StatsService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getSummary() {
        try {
            const {count, error: countError} = await this.supabaseService.getClient().from('companies')
                .select("*", {count: 'exact'});

                if (countError) {
                    throw new BadRequestException({
                        name: countError.name,
                        message: countError.message,
                    });
                }

                return {
                    count,
                };
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
