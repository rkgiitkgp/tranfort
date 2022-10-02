import { get } from 'async-local-storage';
import { UserType } from '../users/constant';
import { User } from '../users/entities/user.entity';
export class RequestContext {
  constructor(public userId: string, public type: UserType) {}

  public static from(user: User): RequestContext {
    const userContext = new RequestContext(user.id, user.type);
    return userContext;
  }
}

export const getRequestContext = async () => {
  const request = await get('request');
  const userContext = new RequestContext(request?.userId, request?.type);
  return userContext;
};
