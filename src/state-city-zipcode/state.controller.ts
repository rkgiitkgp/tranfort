import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { StateDto } from './dto/state.dto';
import { State } from './entities/state.entity';
import { StateService } from './state.service';

@ApiTags('State')
@Controller('state')
// @TenantAuth()
@ApiBearerAuth()
export class StateController {
  constructor(
    @Inject(StateService) private readonly stateService: StateService,
  ) {}

  @Get()
  async getAllState(): Promise<State[]> {
    return await this.stateService.getState({});
  }

  @Get('/:id')
  async findState(@Param('id') id: string): Promise<State[]> {
    return await this.stateService.getState({ ids: [id] });
  }

  @Post()
  async createState(
    @Body(new ValidationPipe({ transform: true })) state: StateDto,
  ): Promise<State> {
    return await this.stateService.saveState(state);
  }

  @Put('/:id')
  async saveState(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) state: StateDto,
  ): Promise<State> {
    return await this.stateService.saveState(state, id);
  }

  @Delete('/:id')
  async deleteState(@Param('id') id: string) {
    await this.stateService.deleteState([id]);
  }
}
