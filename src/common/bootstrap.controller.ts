import { Controller, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { BootstrapService } from './bootstrap.service';
import { BootstrapDto } from './dto/bootstrap.dto';

@ApiTags('Bootstrap')
@Controller('bootstrap')
@TenantAuth()
@ApiBearerAuth()
export class BootstrapController {
  constructor(
    @Inject(BootstrapService)
    public bootstrapService: BootstrapService,
  ) {}

  @Get()
  async bootstrap(): Promise<BootstrapDto> {
    return await this.bootstrapService.bootstrap();
  }
}
