import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fillNull, RepoUtils } from '../common/utils/repository';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const userDao = new User();
    userDao.name = userDto.name;
    userDao.email = userDto.email;
    userDao.mobile = userDto.phoneNumber;
    userDao.password = userDto.password;
    userDao.type = userDto.type;
    return await this.user.save(userDao);
  }

  async getUser(
    take,
    skip,
    filterBy: {
      ids?: string[];
      emails?: string[];
    },
    orderBy?: {
      asc?: string[];
      desc?: string[];
    },
    relations?: [],
  ): Promise<User[]> {
    const idFilter = filterBy.ids ? { id: In(fillNull(filterBy.ids)) } : {};
    const emailFilter = filterBy.emails
      ? { email: In(fillNull(filterBy.emails)) }
      : {};
    return await this.user.find({
      take,
      skip,
      where: [
        {
          deleted: false,
          ...idFilter,
          ...emailFilter,
        },
      ],
      relations,
      order: RepoUtils.generateOrderBy(orderBy),
    });
  }
  async deleteUser(ids: string[]) {
    return await this.user.update(
      { id: In(fillNull(ids)) },
      {
        deleted: true,
        mobile: () => `CONCAT(mobile,id)`,
        email: () => `CONCAT(email,id)`,
      },
    );
  }
}
