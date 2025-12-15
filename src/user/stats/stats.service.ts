import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';

@Injectable()
export class StatsService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getSummaries() {
        try {
            const { data: roles, error: roleError } = await this.supabaseService
                .getClient()
                .from('roles')
                .select('id, name');

            if (roleError) {
                throw new BadRequestException(roleError);
            }

            const { data: allProfiles, error: profilesError } = await this.supabaseService
                .getClient()
                .from('profiles')
                .select('role_id');

            if (profilesError) {
                throw new BadRequestException(profilesError);
            }

            const countMap = new Map<number, number>();
            for (const p of allProfiles) {
                countMap.set(p.role_id, (countMap.get(p.role_id) || 0) + 1);
            }

            return roles.map(role => ({
                id: role.id,
                name: role.name,
                count: countMap.get(role.id) || 0,
            }));
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
