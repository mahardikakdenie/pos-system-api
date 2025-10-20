import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controllers';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, CompanyModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
