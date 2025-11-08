import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controllers';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CompanyModule } from './company/company.module';
import { SupabaseService } from 'supabase/supabase.service';
import { ThemeModule } from './theme/theme.module';
import { ThemeModule } from './theme/theme.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, CompanyModule, ThemeModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, SupabaseService],
})
export class AppModule {}
