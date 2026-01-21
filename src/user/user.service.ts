// user.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from '../auth/auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Paginated } from '../common/types/pagination.type';
import { ProfileDTO, UserDTO } from './user.dto';
import { MailerService } from 'mailer/mailer.service';
import { mergeWithExisting } from 'common/utils/merge-with-existing';
import { entities } from 'common/helpers';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

export const USER_SCHEME = `
      id,
      email,
      role_id,
      status,
      name,
      created_at,
      phone,
      role:roles!inner(
        id,
        name,
        descriptions
      ),
      companies(id)
    `;
@Injectable()
export class UserService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailerService,
  ) { }

  async getUsers(page = 1, limit = 10): Promise<Paginated<Profile>> {
    const offset = (page - 1) * limit;

    const rolesEntities = 'role:roles(id, name, descriptions)';

    // Get data
    const { data, error, count } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select(entities('*', rolesEntities), { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (error) throw new BadRequestException(error.message);

    return {
      limit,
      page,
      data: data as unknown as Profile[],
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
        .select('*', { count: 'planned', head: false });

      if (countError) throw new BadRequestException(countError.message);

      return {
        all: all ?? 0,
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async getUserMe(userId: string) {
    try {
      const { data, error } = await this.getSingleUser(userId);

      if (error) throw new BadRequestException(error.message);

      return {
        data,
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async deleteUserByAdmin(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.deleteUser(userId);

      if (error) throw new BadRequestException(error.message);

      return { data };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async createUser(userPayload: UserDTO) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .auth.admin.createUser({
        email: userPayload.email,
        password: userPayload.password,
        phone: userPayload.phone,
        email_confirm: true,
      });

    if (error) {
      throw new BadRequestException({
        name: error.name,
        message: error.message,
      });
    }

    if (!data?.user) {
      throw new NotFoundException({
        message: 'User creation returned no data',
      });
    }

    const {
      data: profileData,
      error: profileError,
    }: PostgrestResponse<UserDTO> = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({
        role_id: userPayload.role_id,
      })
      .eq('id', data.user.id)
      .select('*')
      .single();

    await this.sendVerificationEmail(userPayload.email);

    if (profileError) {
      throw new BadRequestException({ message: profileError.message });
    }

    return profileData;
  }

  async updateUserProfile(profilPayload: ProfileDTO, userId: string) {
    try {
      const fetchExistingData = async (
        fields: string[],
      ): Promise<Record<string, string> | null> => {
        const { data, error }: PostgrestSingleResponse<Record<string, string>> =
          await this.supabaseService
            .getClient()
            .from('profiles')
            .select(fields.join(','))
            .eq('id', userId)
            .single();

        if (error) {
          throw new BadGatewayException({
            name: error.name,
            message: error.message,
          });
        }
        return data;
      };

      // Merge data
      const mergedData = await mergeWithExisting(
        profilPayload as Partial<ProfileDTO>,
        {
          profileFields: ['username', 'name', 'avatar', 'phone', 'role_id'],
          fetchExistingData: fetchExistingData,
        },
      );
      const { data, error }: PostgrestResponse<Record<string, string>> =
        await this.supabaseService
          .getClient()
          .from('profiles')
          .upsert({ id: userId, ...mergedData })
          .select('*');

      if (error) {
        throw new BadGatewayException({
          message: error.message,
          name: error.name,
        });
      }

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  private async sendVerificationEmail(email: string) {
    const verificationLink = 'https://ensiklotari.id/verify?token=abc123';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <h2>👋 Halo!</h2>
        <p>Terima kasih telah mendaftar di Ensiklotari.</p>
        <p>Silakan verifikasi akun Anda dengan mengklik tombol di bawah:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; 
                    display: inline-block;">
            Verifikasi Akun
          </a>
        </div>
  
        <p style="font-size: 12px; color: #666;">
          Jika tombol tidak berfungsi, salin link berikut:<br>
          ${verificationLink}
        </p>
      </div>
    `;

    await this.mailService.sendEmail(
      email,
      'Verifikasi Akun Anda',
      `Klik link berikut untuk verifikasi: ${verificationLink}`,
      emailBody,
    );
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
