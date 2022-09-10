import { Company } from '../../company/entities/company.entity';
import { User } from '../../users/entities/user.entity';

export class BootstrapDto {
  user: User;
  company?: Company;
}
