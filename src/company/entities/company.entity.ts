import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Address } from '../../common/entities/address.entity';

@Entity('company')
export class Company extends PlatformEntity {
  @Column({ unique: true })
  adharNumber: string;

  @Column({ unique: true })
  panNumber: string;

  @OneToMany(
    () => Address,
    companyAddress => companyAddress.company,
  )
  @JoinColumn()
  companyAddresses: Address[];

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;
}
