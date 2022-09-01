import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-guard';
import { TenantInterceptor } from '../interceptor/tenant.interceptor';

export function TenantAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    UseInterceptors(TenantInterceptor),
  );
}
