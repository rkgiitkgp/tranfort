import { Inject } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { getRequestContext } from '../common/request.context';
import { BootstrapDto } from './dto/bootstrap.dto';
import { CompanyService } from '../company/company.service';

export class BootstrapService {
  constructor(
    @Inject(UserService)
    public usersService: UserService,
    @Inject(CompanyService)
    public companyService: CompanyService,
  ) {}
  async bootstrap(): Promise<BootstrapDto> {
    const requestContext = await getRequestContext();
    const [company] = await this.companyService.getCompany(
      {
        userIds: [requestContext.userId],
      },
      ['companyAddresses'],
    );

    const [user] = await this.usersService.getUser(
      1,
      0,
      { ids: [requestContext.userId] },
      {},
    );
    return {
      user,
      company,
    };
  }
}
