import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { CompanyDTO } from './company.dto';
import { entities } from 'common/helpers';

@Injectable()
export class CompanyService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataCompanies(limit: number = 10, page: number = 1,selectedEntities: string = '', orderBy: string = 'id') {
    try {
        const offset = (page - 1) * limit;
      const { data, error, count } = await this.supabaseService
        .getClient()
        .from('companies')
        .select(entities('*', selectedEntities))
        .order(orderBy, {ascending: true})
        .range(offset, offset + limit - 1);

      if (error) throw new BadGatewayException({ message: error.message });

      return {
        limit,
        page,
        data,
        total: count,
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async createCompanyData(companyPayload: CompanyDTO) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('companies')
        .insert({
          name: companyPayload.name,
          slug: this.generateSlug(companyPayload.slug),
          email: companyPayload.email,
          account_url: companyPayload.account_url,
          status: companyPayload.status || 'requested',
        })
        .select('*');

      if (error) throw new BadGatewayException({ message: error.message });

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  // create generate slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
