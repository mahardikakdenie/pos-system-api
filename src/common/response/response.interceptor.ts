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
import { Paginated } from '../types/pagination.type';

export interface ResponseShape<T> {
  meta: {
    status: number;
    message: string;
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}

// Type guard to check if response is paginated
function isPaginated<T>(obj: any): obj is Paginated<T> {
  console.log("data : ", obj);
  
  return (
    obj &&
    Array.isArray(obj.data) &&
    typeof obj.total === 'number' &&
    (typeof obj.page === 'number' || typeof obj.page === 'string') &&
    typeof obj.limit === 'number'
  );
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseShape<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseShape<T>> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<ResponseShape<T>>;
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const statusCode = response.statusCode || 200;
    const message = this.getMessageFromRequest(request);

    return next.handle().pipe(
      map((data: T) => {
        // ✅ Check if data is a paginated response
        if (isPaginated(data)) {
          const lastPages = Math.ceil(data.total / data.limit);
          return {
            meta: {
              status: statusCode,
              message,
              total: data.total,
              page: data.page,
              per_page: data.limit,
              last_page: lastPages,
            },
            data: data.data,
          };
        }

        // ✅ Fallback: simple array or object
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
    const path = request.route?.path ?? '';

    if (method === 'POST') {
      if (path.includes('login')) return 'Successfully logged in';
      return 'Successfully created';
    }
    if (method === 'PUT' || method === 'PATCH') return 'Successfully updated';
    if (method === 'DELETE') return 'Successfully deleted';
    return 'Success';
  }
}
