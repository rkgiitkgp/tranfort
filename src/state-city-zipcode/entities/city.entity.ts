import { IsUUID } from 'class-validator';
import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { State } from './state.entity';
import { Zipcode } from './zipcode.entity';

@Entity('city')
export class City extends PlatformEntity {
  @Column({ unique: true })
  name: string;

  @ManyToOne(
    () => State,
    state => state.cities,
  )
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state: State;

  @IsUUID()
  @Column({ name: 'state_id' })
  stateId: string;

  @OneToMany(
    () => Zipcode,
    zipcode => zipcode.city,
  )
  codes: Zipcode[];
}
