// user.service.ts
import { Injectable } from '@nestjs/common';
import { Profile } from '../auth/auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Paginated } from '../common/types/pagination.type';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUsers(page = 1, limit = 10): Promise<Paginated<Profile>> {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*', { count: 'exact', head: false })
      .neq('role_id', 0);

    if (countError) throw new Error(countError.message);

    // Get data
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select(
        `
        id,
        email,
        role_id,
        status,
        role:roles!inner(
          id,
          name,
          descriptions
        )
      `,
      )
      .neq('role_id', 0)
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return {
      limit,
      page,
      data: data,
      total: count as number,
    };
  }

  async getSummary(): Promise<{
    all: number;
  }> {
    try {
      // Get All data user counter
      const { count: all, error: countError } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('*', { count: 'exact', head: false })
        .neq('role_id', 0);

        if (countError) throw new Error(countError.message);

        return {
          all: all ?? 0,
        }
    } catch (error) {
      throw new Error(error);
    }
  }
}
