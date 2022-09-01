import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { RequestContext } from '../common/request.context';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userDao = new User();
    userDao.name = createUserDto.name;
    userDao.email = createUserDto.email.toLowerCase();
    userDao.password = createUserDto.password;
    userDao.mobile = createUserDto.phoneNumber;
    userDao.type = createUserDto.type;
    const result = await userDao.save();
    return result;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const [user] = await this.user
      .createQueryBuilder('user')
      .andWhere('user.deleted = false')
      .andWhere('user.email = :email', { email: email.toLocaleLowerCase() })
      .getMany();

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = await this.generateJWT(RequestContext.from(user));
        return {
          token: token,
          user: user,
        };
      }
      throw new UnauthorizedException(`wrong password`);
    }

    throw new HttpException('Invalid User', HttpStatus.UNAUTHORIZED);
  }

  generateJWT(user: RequestContext) {
    return this.jwtService.signAsync({ user });
  }
}
