import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantAuth } from '../auth/decorator/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@TenantAuth()
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject(UserService)
    private usersService: UserService,
  ) {}

  @Get()
  async getAllUser(): Promise<User[]> {
    return await this.usersService.getUser(10000, 0, {}, {}, []);
  }
  @Get('/:id')
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User[]> {
    return await this.usersService.getUser(1, 0, { ids: [id] }, {}, []);
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteUser([id]);
  }
}
