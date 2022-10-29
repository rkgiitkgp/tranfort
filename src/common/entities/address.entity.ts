import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { AddressType } from '../constant';
import { PlatformEntity } from '../platform.entity';

@Entity({ name: 'address' })
export class Address extends PlatformEntity {
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
  @JoinColumn({ referencedColumnName: 'id', name: 'entity_id' })
  company: Company;

  @Column()
  entityId: string;

  @Column({ nullable: true })
  type: AddressType;
}
