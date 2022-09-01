import { IsUUID } from 'class-validator';
import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { City } from './city.entity';

@Entity('zipcode')
export class Zipcode extends PlatformEntity {
  @Column({ unique: true })
  code: string;

  @ManyToOne(
    () => City,
    city => city.codes,
  )
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city: City;

  @IsUUID()
  @Column({ name: 'city_id' })
  cityId: string;
}
