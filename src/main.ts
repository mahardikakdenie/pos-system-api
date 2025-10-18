// src/main.ts
import { config } from 'dotenv'; // ← tambahkan ini
config(); // ← muat .env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { AllExceptionsFilter } from 'common/response/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus properti non-DTO
      forbidNonWhitelisted: true, // Tolak properti tidak dikenal
      transform: true, // Transform ke instance class
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? '');
}
void bootstrap();
