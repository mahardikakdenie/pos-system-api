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
      const { data: roles, error: roleError } = await this.supabaseService
        .getClient()
        .from('roles')
        .select('id, name');

      if (roleError) {
        throw new BadRequestException(roleError);
      }

      const {
        data: allProfiles,
        error: profilesError,
        count,
      } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('role_id, created_at, status', { count: 'exact' });

      if (profilesError) {
        throw new BadRequestException(profilesError);
      }

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const countMap = new Map<number, number>();
      let newCount = 0;

      for (const p of allProfiles) {
        const roleCount = countMap.get(p.role_id) || 0;
        countMap.set(p.role_id, roleCount + 1);

        if (new Date(p.created_at) >= sevenDaysAgo) {
          newCount++;
        }
      }

      const { count: countActive } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('status, email', { count: 'exact' })
        .eq('status', 'active');

      const { count: countInActive } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('status, email', { count: 'exact' })
        .eq('status', 'inactive');

      const result: {
        [key: string]: number;
        all: number;
        new: number;
        active: number;
        inactive: number;
      } = {
        all: count ?? 0,
        new: newCount,
        active: countActive ?? 0,
        inactive: countInActive ?? 0,
      };

      for (const role of roles) {
        const count = countMap.get(role.id) || 0;
        result[role.name] = count;
      }

      return result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
