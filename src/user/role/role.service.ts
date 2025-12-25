import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { entities } from 'common/helpers';
import { SupabaseService } from 'supabase/supabase.service';
import { RoleDTO } from './role.dto';
import { mergeWithExisting } from 'common/utils/merge-with-existing';

@Injectable()
export class RoleService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getData(
        page: number = 1,
        limit: number = 10,
        selectedEntities: string = '',
        search: string = '',
        orderBy: string = 'name',
        sorting: 'desc' | 'asc' = 'desc'
    ) {
        try {
            const offset = (page - 1) * limit;
            let query = this.supabaseService.getClient()
                .from('roles')
                .select(entities('*', selectedEntities), { count: 'exact' })
                .order(orderBy, { ascending: sorting === 'desc' })
                .range(offset, offset + limit - 1);

            if (search) {
                query = query.like('name', `%${search}%`);
            }

            const { data, error, count } = await query;

            if (error) {
                throw new BadGatewayException({
                    name: error.name,
                    message: error.message,
                });
            }

            return {
                limit,
                page,
                data: data as unknown,
                total: count as number,
            };
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }


    async createRole(rolePayload: RoleDTO) {
        try {
            const { data, error } = await this.supabaseService
                .getClient()
                .from('roles')
                .insert(rolePayload)
                .select('*');

            if (error) {
                throw new BadRequestException({
                    message: error.message,
                    reason: error.message,
                });
            }

            return data;
        } catch (error) {
            throw new BadGatewayException('Unexpected error while creating role');
        }
    }

    async updateRole(rolePayload: RoleDTO, roleId: number) {
        try {
            const fetchExistingData = async (
                fields: string[],
            ): Promise<any | null> => {
                const { data, error } = await this.supabaseService
                    .getClient()
                    .from('roles')
                    .select(fields.join(','))
                    .eq('id', roleId)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') return null;
                    throw new BadGatewayException({
                        name: error.name,
                        message: error.message,
                    });
                }
                return data;
            };
            
            const mergedData = await mergeWithExisting(
                rolePayload as Partial<RoleDTO>,
                {
                    profileFields: ['name', 'descriptions'],
                    fetchExistingData: fetchExistingData,
                },
            );

            const { data, error } = await this.supabaseService.getClient()
                .from('roles')
                .upsert({ id: roleId, ...mergedData })
                .select('*');

                if (error) {
                    throw new BadRequestException({
                        name: error.name,
                        message: error.message,
                    });
                }

                return data;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async deleteRole(roleId: number) {
        try {
            const {data, error} = await this.supabaseService.getClient().from('roles')
                .delete()
                .eq('id', roleId).select('*');

                if (error) {
                    throw new BadRequestException({
                        name: error.name,
                        message: error.message,
                    });
                }

                return data;
        } catch (error) {
            throw new BadGatewayException(error);   
        }
    }
}
