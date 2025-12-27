import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { entities } from 'common/helpers';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class RoleStatsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataSummary() {
    try {
      const {count, error} = await this.supabaseService
        .getClient()
        .from('roles')
        .select(entities('*', ''), { count: 'exact' });

        if (error) {
            throw new BadRequestException({
                name: error.name,
                message: error.message,
            });
        }

        return {
            all: count,
        }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
