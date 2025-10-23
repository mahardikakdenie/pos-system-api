// src/common/decorators/require-profile.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Profile } from 'auth/auth.service';

export const RequireProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const profile = request['profile'] as Profile | null;

    if (profile === null) {
      throw new Error('User not found');
    }

    return profile;
  },
);
