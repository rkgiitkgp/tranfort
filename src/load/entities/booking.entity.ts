import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Load } from './load.entity';
import { User } from '../../users/entities/user.entity';

@Entity('booking')
@Unique(['loadId', 'createdBy'])
export class Booking extends PlatformEntity {
  //transporter
  @ManyToOne(
    () => User,
    user => user.bookings,
  )
  @JoinColumn({ referencedColumnName: 'id', name: 'created_by' })
  user: User;

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
