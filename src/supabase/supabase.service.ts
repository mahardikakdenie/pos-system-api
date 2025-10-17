/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/supabase/supabase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  onModuleInit() {
    const url: string = process.env.SUPABASE_URL ?? '';
    const key: string = process.env.SUPABASE_ANON_KEY ?? '';

    if (typeof url !== 'string' || typeof key !== 'string' || !url || !key) {
      throw new Error('SUPABASE_URL dan SUPABASE_ANON_KEY wajib di .env');
    }

    this.client = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
