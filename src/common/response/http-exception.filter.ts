// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  meta: {
    status: number;
    message: string;
  };
  data: null;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal server error';

    const errorResponse: ErrorResponse = {
      meta: {
        status,
        message,
      },
      data: null,
    };

    // Log error di server (opsional)
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new InternalServerErrorException(exception);
    }

    response.status(status).json(errorResponse);
  }

  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    if (typeof response === 'object' && response !== null) {
      return (response as any).message || 'Bad Request';
    }
    return 'Bad Request';
  }
}
