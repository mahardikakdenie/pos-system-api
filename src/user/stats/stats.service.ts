import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class StatsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getSummaries() {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const {
        data: allProfiles,
        error: profilesError,
        count: totalCount,
      } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('role_id, created_at, status', { count: 'exact' });

      if (profilesError) {
        throw new BadRequestException(profilesError);
      }

      let newCount = 0;
      const currentRoleCounts = new Map<number, number>();

      for (const p of allProfiles) {
        const roleCount = currentRoleCounts.get(p.role_id) || 0;
        currentRoleCounts.set(p.role_id, roleCount + 1);

        if (new Date(p.created_at) >= sevenDaysAgo) {
          newCount++;
        }
      }

      const { count: countActive } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('status', { count: 'exact' })
        .eq('status', 'active');

      const { count: countInActive } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('status', { count: 'exact' })
        .eq('status', 'inactive');

      // === Bulan Ini (30 hari terakhir) ===
      const { count: allThisMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: newThisMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString());

      const { count: activeThisMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: inactiveThisMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('status', 'inactive')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const roleCountsThisMonth = new Map<number, number>();
      const { data: profilesThisMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('role_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      for (const p of profilesThisMonth ?? []) {
        roleCountsThisMonth.set(p.role_id, (roleCountsThisMonth.get(p.role_id) || 0) + 1);
      }

      // === Bulan Lalu (hari ke-60 s.d ke-30) ===
      const { count: allLastMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const sevenDaysAgoLastMonth = new Date(sixtyDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000);
      const { count: newLastMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', sevenDaysAgoLastMonth.toISOString());

      const { count: activeLastMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const { count: inactiveLastMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('status', 'inactive')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const roleCountsLastMonth = new Map<number, number>();
      const { data: profilesLastMonth } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('role_id')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      for (const p of (profilesLastMonth ?? [])) {
        roleCountsLastMonth.set(p.role_id, (roleCountsLastMonth.get(p.role_id) || 0) + 1);
      }

      const calcChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return parseFloat(((current - previous) / previous * 100).toFixed(2));
      };

      const result: Record<string, number> = {
        all: totalCount ?? 0,
        all_change_percent: calcChange(allThisMonth ?? 0, allLastMonth ?? 0),

        new: newCount,
        new_change_percent: calcChange(newThisMonth ?? 0, newLastMonth ?? 0),

        active: countActive ?? 0,
        active_change_percent: calcChange(activeThisMonth ?? 0, activeLastMonth ?? 0),

        inactive: countInActive ?? 0,
        inactive_change_percent: calcChange(inactiveThisMonth ?? 0, inactiveLastMonth ?? 0),
      };
    
      return result;
    } catch (error) {
      throw new BadGatewayException('Failed to fetch statistics', {
        cause: error,
      });
    }
  }
}
