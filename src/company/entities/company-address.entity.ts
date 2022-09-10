import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { PlatformEntity } from '../../common/platform.entity';

@Entity({ name: 'company_address' })
export class CompanyAddress extends PlatformEntity {
  @Column({ default: false })
  isDefault: boolean;

  @Column({ name: 'address_name' })
  addressName: string;

  @Column({ nullable: true })
  cityId: string;

  @Column({ nullable: true })
  stateId: string;

  @Column({ nullable: true })
  zipcodeId: string;

  @ManyToOne(
    () => Company,
    company => company.companyAddresses,
  )
  @JoinColumn()
  company: Company;

  @Column()
  companyId: string;
}
