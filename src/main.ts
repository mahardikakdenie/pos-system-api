// src/main.ts
import { config } from 'dotenv'; // ← tambahkan ini
config(); // ← muat .env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { AllExceptionsFilter } from 'common/response/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('The CMS API description')
    .setVersion('1.0')
    .addTag('CMS DASHBOARD SYSTEM')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? '');
}
void bootstrap();
