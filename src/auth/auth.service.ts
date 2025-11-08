// src/auth/auth.service.ts
// import { config } from 'dotenv'; // ← tambahkan ini
// config();
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './auth.dto';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  [key: string]: any;
}

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw new UnauthorizedException(
          error.message || 'Invalid email or password',
        );
      }

      const { session } = data;
      const user = session.user;

      const {
        data: profile,
        error: profileError,
      }: PostgrestSingleResponse<Profile> = await this.supabaseService // PostgrestSingleResponse<Profile>
        .getClient()
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (
        profileError &&
        profileError.code !== 'PGRST116' // PGRST116 = no rows returned
      ) {
        console.error('Profile fetch error:', profileError);
        throw new InternalServerErrorException('Failed to load user profile');
      }

      const metaData = {
        access_token: session.access_token,
      };

      // ✅ Respons sukses
      return {
        data: metaData,
      };
    } catch (err) {
      // Tangani error tak terduga
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Authentication service error ${err}`,
      );
    }
  }

  async register(email: string, password: string) {
    try {
      // Check User
      const { data: user, error: errorFetchedUser } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('email')
        .eq('email', email);

      if (errorFetchedUser) {
        // errorFetchedUser dari Supabase (misal: email sudah terdaftar, password lemah)
        throw new BadRequestException(
          `users failed : ${errorFetchedUser.message}`,
        );
      }

      if (user.length > 0) {
        throw new BadRequestException('Email Sudah Terpakai');
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://kanban.mahardikakdenie.my.id',
          },
        });

      if (error) {
        // Error dari Supabase (misal: email sudah terdaftar, password lemah)
        throw new BadRequestException(error.message || 'Registration failed');
      }

      return {
        success: true,
        message: 'Registration successful. Please check your email to confirm.',
        user: {
          email: data.user?.email,
          id: data.user?.id,
        },
      };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof UnauthorizedException
      ) {
        throw err;
      }
      console.error('Registration error:', err);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  async logout(
    accessToken: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.supabaseService.getClient().auth.signOut();
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (err) {
      console.error('Logout error:', err);
      throw new InternalServerErrorException('Logout service error');
    }
  }
}
