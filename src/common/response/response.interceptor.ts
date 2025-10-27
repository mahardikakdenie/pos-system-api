// src/common/interceptors/response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseShape {
  meta: {
    status: number;
    message: string;
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
  data: unknown; // ✅ gunakan unknown, bukan T
}

function isPaginated(obj: any): obj is { data: unknown[]; total: number; page: number; limit: number } {
  if (!obj || !Array.isArray(obj.data)) return false;
  const hasOwn = Object.hasOwn || ((o, p) => Object.prototype.hasOwnProperty.call(o, p));
  return hasOwn(obj, 'total') && hasOwn(obj, 'page') && hasOwn(obj, 'limit');
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseShape> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<any>;
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const statusCode = response.statusCode || 200;
    const message = this.getMessageFromRequest(request);

    return next.handle().pipe(
      map((data: unknown) => {
        if (isPaginated(data)) {
          const total = Number(data.total);
          const page = Number(data.page);
          const perPage = Number(data.limit);
          const lastPage = Math.ceil(total / perPage);

          return {
            meta: {
              status: statusCode,
              message,
              total,
              page,
              per_page: perPage,
              last_page: lastPage,
            },
            data: data.data,
          };
        }

        const total = Array.isArray(data) ? data.length : undefined;
        return {
          meta: {
            status: statusCode,
            message,
            ...(total !== undefined ? { total } : {}),
          },
          data,
        };
      }),
    );
  }

  private getMessageFromRequest(request: Request): string {
    const method = request.method;
    switch (method) {
      case 'POST':
        return request.route?.path?.includes('login')
          ? 'Successfully logged in'
          : 'Successfully created';
      case 'PUT':
      case 'PATCH':
        return 'Successfully updated';
      case 'DELETE':
        return 'Successfully deleted';
      default:
        return 'Success';
    }
  }
}
