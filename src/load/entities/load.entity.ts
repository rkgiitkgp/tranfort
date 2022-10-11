import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { LoadStatus, VehicleRequirement } from '../constant';
import { LineItem } from './line-item.entity';
import { LoadAddress } from './load-address.entity';
import { Booking } from './booking.entity';
import { User } from '../../users/entities/user.entity';

@Entity('load')
export class Load extends PlatformEntity {
  @ManyToOne(
    () => User,
    user => user.loads,
  )
  @JoinColumn({ referencedColumnName: 'id', name: 'created_by' })
  user: User;

  @OneToMany(
    () => LineItem,
    loadItem => loadItem.load,
    { cascade: true },
  )
  lineItems: LineItem[];

  @Column({ generated: 'increment', width: 6 })
  orderNumber: number;

  @ManyToOne(
    () => LoadAddress,
    loadAddress => loadAddress.sourceLoads,
  )
  @JoinColumn({ name: 'source_address_id', referencedColumnName: 'id' })
  sourceAddress: LoadAddress;

  @Column({ type: 'uuid' })
  sourceAddressId: string;

  @ManyToOne(
    () => LoadAddress,
    loadAddress => loadAddress.destinationLoads,
  )
  @JoinColumn({ name: 'destination_address_id', referencedColumnName: 'id' })
  destinationAddress: LoadAddress;

  @Column({ type: 'uuid' })
  destinationAddressId: string;

  @Column({ nullable: true, type: 'float' })
  priceRate: number;

  @Column({ type: 'jsonb', nullable: true })
  vehicleRequirement: VehicleRequirement;

  @Column({ name: 'payment_term_id', nullable: true, type: 'uuid' })
  paymentTermId: string;

  @Column({ nullable: true, type: 'float' })
  advancePayment: number;

  @Column({ nullable: true, type: 'float' })
  advanceInPercentage: number;

  @Column({ nullable: true, type: 'float' })
  totalPrice: number;

  @Column()
  status: LoadStatus;

  @OneToMany(
    () => Booking,
    booking => booking.load,
  )
  bookings: Booking[];

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  additionalNotes: string;
}
