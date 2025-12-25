import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { entities } from 'common/helpers';
import { SupabaseService } from 'supabase/supabase.service';
import { ProfileDATA } from 'user/user.dto';

@Injectable()
export class TenantService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataOrder(profile: ProfileDATA, selectedEntities: string) {
    try {
      if (!profile) throw new UnauthorizedException();
      const { data, error } = await this.supabaseService
        .getClient()
        .from('orders')
        .select(entities('*', selectedEntities))
        .eq('company_id', profile.company_id);

      if (error) {
        throw new BadRequestException({
          name: error.name,
          message: error.message,
        });
      }

      return data;
    } catch (error) {
      if (error as Error) {
        throw new BadGatewayException(error.message);
      }

      throw new BadGatewayException(error);
    }
  }
}
