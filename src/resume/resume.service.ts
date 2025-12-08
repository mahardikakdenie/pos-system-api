import {
  BadRequestException,
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { ResumeDTO } from './resume.dto';
import { generateSlug } from 'common/helpers';
import { Profile } from 'common/types/profile.type';

const RESUME_SCHEMA = `
  id,
  name,
  owner_id,
  slug,
  type,
  status,
  description,
  profile:profiles!inner(
    id,
    email
  ),
  projects(id, name)
`;

@Injectable()
export class ResumeService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getDataResume() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('resumes')
        .select(RESUME_SCHEMA);

      if (error) {
        throw new BadGatewayException({
          message: error.message || 'Failed to fetch resumes',
          name: error.name || 'SupabaseError',
        });
      }

      return data;
    } catch (err: any) {
      throw new BadGatewayException({
        message: err.message || 'Unexpected error in fetching resumes',
        name: err.name || 'UnknownError',
      });
    }
  }

  async createResume(resumePayload: ResumeDTO, profile: Profile) {
    if (!profile) {
      throw new UnauthorizedException('Profile is required');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('resumes')
        .insert({
          ...resumePayload,
          owner_id: profile.id,
          slug: generateSlug(resumePayload.name),
        })
        .select(RESUME_SCHEMA);

      if (error) {
        throw new BadGatewayException({
          message: error.message || 'Failed to create resume',
          name: error.name || 'SupabaseError',
        });
      }

      return data?.[0];
    } catch (err: any) {
      throw new BadGatewayException({
        message: err.message || 'Unexpected error during resume creation',
        name: err.name || 'UnknownError',
      });
    }
  }

  async updateResume(resumePayload: ResumeDTO, resumeId: number) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('resumes')
        .update({
          name: resumePayload.name,
          description: resumePayload.description,
          status: resumePayload.status,
          type: resumePayload.type,
          slug: generateSlug(resumePayload.name),
        })
        .eq('id', resumeId)
        .select(RESUME_SCHEMA);

      if (error) {
        throw new BadGatewayException({
          message: error.message || 'Failed to update resume',
          name: error.name || 'SupabaseError',
        });
      }

      return data?.[0];
    } catch (err: any) {
      throw new BadGatewayException({
        message: err.message || 'Unexpected error during resume update',
        name: err.name || 'UnknownError',
      });
    }
  }
}
