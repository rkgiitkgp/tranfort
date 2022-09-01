import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { City } from './city.entity';

@Entity('state')
export class State extends PlatformEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  GST: number;

  @OneToMany(
    () => City,
    city => city.state,
  )
  cities: City[];
}
