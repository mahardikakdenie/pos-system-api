import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { ProjectDTO } from './project.dto';

@Injectable()
export class ProjectService {
    constructor(private readonly supabaseService: SupabaseService) { }
    async getDataProjects() {
        try {
            const { data, error } = await this.supabaseService.getClient()
                .from('projects')
                .select('*');

            if (error) {
                throw new BadGatewayException({
                    message: error.message,
                    name: error.name,
                })
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
            const { data, error } = await this.supabaseService.getClient()
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
}
