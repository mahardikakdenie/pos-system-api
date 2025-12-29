import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { CompanyDTO } from './company.dto';
import { entities } from 'common/helpers';

@Injectable()
export class CompanyService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataCompanies(selectedEntities: string = '', orderBy: string = 'id') {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('companies')
        .select(entities('*', selectedEntities))
        .order(orderBy);

      if (error) throw new BadGatewayException({ message: error.message });

      return data;
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
