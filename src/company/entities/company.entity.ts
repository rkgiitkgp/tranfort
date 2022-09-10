import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CompanyAddress } from './company-address.entity';

@Entity('company')
export class Company extends PlatformEntity {
  @Column({ unique: true })
  adharNumber: string;

  @Column({ unique: true })
  panNumber: string;

  @Column()
  companyAddressId: string;

  @OneToMany(
    () => CompanyAddress,
    companyAddress => companyAddress.company,
  )
  @JoinColumn()
  companyAddresses: CompanyAddress[];

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;
}
