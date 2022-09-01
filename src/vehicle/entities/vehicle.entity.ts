import { Column, Entity, Unique } from 'typeorm';
import { PlatformEntity } from '../../common/platform.entity';

@Entity({ name: 'vehicle' })
@Unique(['vehicleNumber'])
export class Vehicle extends PlatformEntity {
  @Column()
  vehicleNumber: string;

  @Column()
  fuelType: string;

  @Column()
  model: string;

  @Column()
  capacity: string;

  @Column()
  age: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  containerType: string;
}
