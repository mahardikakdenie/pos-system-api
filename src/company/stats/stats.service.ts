import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class StatsService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async getSummary(days: number = 7) {
        try {
            const client = this.supabaseService.getClient();

            const now = new Date();
            const currentRangeStart = new Date();
            currentRangeStart.setDate(now.getDate() - days);

            const previousRangeStart = new Date();
            previousRangeStart.setDate(currentRangeStart.getDate() - days);

            const [currentRes, previousRes, totalRes] = await Promise.all([
                client.from('companies')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', currentRangeStart.toISOString()),
                client.from('companies')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', previousRangeStart.toISOString())
                    .lt('created_at', currentRangeStart.toISOString()),
                client.from('companies')
                    .select('*', { count: 'exact', head: true })
            ]);

            if (currentRes.error) throw currentRes.error;
            if (previousRes.error) throw previousRes.error;
            if (totalRes.error) throw totalRes.error;

            const currentCount = currentRes.count || 0;
            const previousCount = previousRes.count || 0;

            let percentageChange = 0;
            if (previousCount > 0) {
                percentageChange = ((currentCount - previousCount) / previousCount) * 100;
            } else if (currentCount > 0) {
                percentageChange = 100;
            }

            return {
                total: totalRes.count || 0,
                newItems: currentCount,
                previousPeriodItems: previousCount,
                percentageChange: parseFloat(percentageChange.toFixed(2)),
                isIncrease: percentageChange >= 0,
                periodDays: days,
                updatedAt: new Date().toISOString()
            };
        } catch (error) {
            if (error.message) {
                throw new BadRequestException({
                    name: error.name || 'SupabaseError',
                    message: error.message,
                });
            }
            throw new BadGatewayException('Failed to calculate dynamic statistics');
        }
    }
}
