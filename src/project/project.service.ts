import { BadGatewayException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { ProjectDTO } from './project.dto';
import { Paginated } from '../common/types/pagination.type';
import { entities } from '../common/helpers';

@Injectable()
export class ProjectService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getDataProjects(page: number = 1, limit: number = 10, selectedEntities: string = ''): Promise<Paginated<ProjectDTO>> {
        try {
            const offset = (page - 1) * limit;
            const { data, error, count } = await this.supabaseService
                .getClient()
                .from('projects')
                .select(entities('*', selectedEntities), { count: 'exact' })
                .range(offset, offset + limit - 1);

            if (error) {
                throw new BadGatewayException({
                    message: error.message,
                    name: error.name,
                });
            }

            return {
                limit,
                page,
                data: data as unknown as ProjectDTO[],
                total: count as number,
            };
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

    async deleteProjects(projectId: number) {
        try {
            const { data, error } = await this.supabaseService
                .getClient()
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
            throw new BadGatewayException({
                message: error.message,
                name: error.name,
            });
        }
    }
}
