import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PlatformEntity } from '../../common/platform.entity';
import { ChallanEnum } from '../constant';
import { VehicleDto } from '../dto/vehicle.dto';
import { ChallanLineItem } from './challan-line-item.entity';
import { Load } from './load.entity';

@Entity('challan')
export class Challan extends PlatformEntity {
  // challan used to created by Transporter
  // if multiple booking for a single load, then challan will be multiple
  @ManyToOne(
    () => Load,
    load => load.challans,
  )
  @JoinColumn({ name: 'load_id', referencedColumnName: 'id' })
  load: Load;

  @Column({ type: 'uuid' })
  loadId: string;

  //if multiple booking for a single load
  @Column({ type: 'uuid' })
  bookingId: string;

  //userId type: Driver
  @Column({ type: 'uuid' })
  driverId: string;

  @Column({ type: 'jsonb' })
  vehicle: VehicleDto;

  @Column()
  status: ChallanEnum;

  @OneToMany(
    () => ChallanLineItem,
    cli => cli.challan,
    { cascade: true },
  )
  challanLineItems: ChallanLineItem[];
}
