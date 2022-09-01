import { Column, Entity, OneToMany } from 'typeorm';
import { PlatformEntity } from '../../common/platform.entity';
import { Load } from './load.entity';

@Entity({ name: 'load_address' })
export class LoadAddress extends PlatformEntity {
  @OneToMany(
    () => Load,
    loads => loads.sourceAddress,
  )
  sourceLoads: Load[];
  @OneToMany(
    () => Load,
    loads => loads.destinationAddress,
  )
  destinationLoads: Load[];
  @Column({ default: false })
  isDefault: boolean;

  @Column({ name: 'address_name' })
  addressName: string;

  @Column({ nullable: true, type: 'uuid' })
  cityId: string;

  @Column({ nullable: true, type: 'uuid' })
  stateId: string;

  @Column({ nullable: true, type: 'uuid' })
  zipcodeId: string;

  @Column()
  country: string;

  @Column({ default: false })
  isInternational: boolean;
}
