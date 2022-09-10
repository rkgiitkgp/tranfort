import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { BootstrapService } from './bootstrap.service';
import { BootstrapController } from './bootstrap.controller';
import { CompanyModule } from '../company/company.module';
@Module({
  imports: [TypeOrmModule.forFeature([]), UserModule, CompanyModule],
  controllers: [BootstrapController],
  providers: [BootstrapService],
})
export class CommonModule {}
