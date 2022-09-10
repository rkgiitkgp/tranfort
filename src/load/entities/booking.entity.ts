import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Load } from './load.entity';

@Entity('booking')
@Unique(['loadId', 'createdBy'])
export class Booking extends PlatformEntity {
  @ManyToOne(
    () => Load,
    load => load.bookings,
  )
  @JoinColumn()
  load: Load;

  @Column({ type: 'uuid' })
  loadId: string;

  @Column({ default: false })
  confirmation: boolean;

  @Column({ nullable: true })
  comments: string;
}
