import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export const sendError = (error, entity): any => {
  switch (error.code) {
    case '23505':
      throw new ConflictException([`${entity} already exist`]);
    case '23502':
      throw new BadRequestException([`${error.column} value is mandatory`]);
    case '00000':
      throw new BadRequestException(error.message); 
    default:
      throw new InternalServerErrorException([`error while saving ${entity}`, error]);
  }
};
