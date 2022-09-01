import {
  Injectable,
  CanActivate,
  Inject,
  forwardRef,
  ExecutionContext,
} from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user: User = request.user;

    const savedUser = await this.userService.getUser(1, 0, { ids: [user.id] });
    return savedUser != null;
  }
}
