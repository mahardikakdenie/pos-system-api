import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { ProjectDTO } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async getDataProjects() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('projects')
        .select('*');

      if (error) {
        throw new BadGatewayException({
          message: error.message,
          name: error.name,
        });
      }

      return data;
    } catch (error) {
      throw new BadGatewayException({
        message: error.message,
        name: error.name,
      });
    }
  }

  async createProject(projectPayload: ProjectDTO) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('projects')
        .insert(projectPayload)
        .select('*');

      if (error) {
        throw new BadGatewayException({
          message: error.message,
          name: error.name,
        });
      }

      return data;
    } catch (error) {
      throw new BadGatewayException({
        message: error.message,
        name: error.name,
      });
    }
  }

  async updateProjects(projectPayload: ProjectDTO, projectId: number) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('projects')
        .update(projectPayload)
        .eq('id', projectId)
        .select('*');

      if (error) {
        throw new BadGatewayException({
          name: error.name,
          message: error.message,
        });
      }

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async deleteProjects(projectId: number) {
    try {
        const {data, error} = await this.supabaseService.getClient()
            .from('projects')
            .delete()
            .eq('id', projectId)
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
}
