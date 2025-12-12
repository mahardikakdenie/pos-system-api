// user.service.ts
import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '../auth/auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Paginated } from '../common/types/pagination.type';
import { UserDTO } from './user.dto';
import { PostgrestResponse, User } from '@supabase/supabase-js';
import { MailerService } from 'mailer/mailer.service';

export const USER_SCHEME = `
      id,
      email,
      role_id,
      status,
      created_at,
      phone,
      role:roles!inner(
        id,
        name,
        descriptions
      )
    `;
@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService, private readonly mailService: MailerService) {}

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
      .select(USER_SCHEME)
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
        .select('*', { count: 'planned', head: false })
        .neq('role_id', 0);

      if (countError) throw new Error(countError.message);

      return {
        all: all ?? 0,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserMe(userId: string) {
    try {
      const { data, error } = await this.getSingleUser(userId);

      if (error) throw new Error(error.message);

      return {
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUserByAdmin(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.deleteUser(userId);

      return {
        data,
        error,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(userPayload: UserDTO) {
    // HAPUS try-catch global, atau handle dengan benar

    const { data, error } = await this.supabaseService
      .getAdminClient()
      .auth.admin.createUser({
        email: userPayload.email,
        password: userPayload.password,
        phone: userPayload.phone,
        email_confirm: true,
      });

    if (error) {
      throw new BadRequestException(
        {
          name: error.name,
          message: error.message,
        },
      );
    }

    if (!data?.user) {
      throw new NotFoundException(
        { message: 'User creation returned no data' },
      );
    }

    const { data: profileData, error: profileError } =
      await this.supabaseService
        .getClient()
        .from('profiles')
        .update({
          role_id: userPayload.role_id,
        })
        .eq('id', data.user.id)
        .select('*')
        .single();
        await this.mailService.sendEmail(
  userPayload.email,
  'Verifikasi Akun Anda',
  'Klik link berikut untuk verifikasi: https://ensiklotari.id/verify?token=abc123',
  `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
      <h2>👋 Halo!</h2>
      <p>Terima kasih telah mendaftar di Ensiklotari.</p>
      <p>Silakan verifikasi akun Anda dengan mengklik tombol di bawah:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://ensiklotari.id/verify?token=abc123"
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                  display: inline-block;">
          Verifikasi Akun
        </a>
      </div>

      <p style="font-size: 12px; color: #666;">
        Jika tombol tidak berfungsi, salin link berikut:<br>
        https://ensiklotari.id/verify?token=abc123
      </p>
    </div>
  `,
);

    if (profileError) {
      throw new BadRequestException(
        { message: profileError.message },
      );
    }

    return {
      profileData,
    };
  }
  
  async updateUserProfile(profilPayload: UserDTO, userId: string) {
    try {
      const {data, error} = await this.supabaseService.getClient()
        .from('profiles')
        .update(profilPayload)
        .eq('id', userId)
        .select('*');

      if (error) {
        throw new BadGatewayException({
          message: error.message,
          name: error.name,
        })
      };


      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  // === Helpers ===
  async getSingleUser(userId: string) {
    const user = await this.supabaseService
      .getClient()
      .from('profiles')
      .select(USER_SCHEME)
      .eq('id', userId)
      .single();

    return user;
  }
}
