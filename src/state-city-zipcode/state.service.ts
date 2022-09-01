import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendError } from '../common/error.service';
import { In, Repository } from 'typeorm';
import { fillNull } from '../common/utils/repository';
import { StateDto } from './dto/state.dto';
import { State } from './entities/state.entity';

@Injectable()
export class StateService {
  constructor(@InjectRepository(State) public state: Repository<State>) { }

  async getState(filterBy: { ids?: string[] }): Promise<State[]> {
    let idFilter = {};
    if (filterBy) {
      if (filterBy.ids) idFilter = { id: In(fillNull(filterBy.ids)) };
    }

    return await this.state.find({
      where: [
        {
          deleted: false,
          ...idFilter,
        },
      ],
      order: { name: 'ASC' },
    });
  }

  async saveState(stateDto: StateDto, id?: string): Promise<State> {
    const stateDao = new State();
    if (id != undefined) stateDao.id = id;
    stateDao.name = stateDto.name;
    stateDao.GST = stateDto.GST;
    try {
      return await stateDao.save();
    } catch (error) {
      sendError(error, 'state');
    }
  }

  async deleteState(ids: string[]) {
    return await this.state.update(
      { id: In(fillNull(ids)) },
      { deleted: true },
    );
  }
}
