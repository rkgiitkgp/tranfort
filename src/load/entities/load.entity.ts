import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { LoadStatus } from '../constant';
import { LineItem } from './line-item.entity';
import { LoadAddress } from './load-address.entity';

@Entity('load')
export class Load extends PlatformEntity {
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
  sourchAddressId: string;

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

  @Column('text', { array: true, default: [] })
  vehicleRequirement: string[];

  @Column({ name: 'payment_term_id', nullable: true, type: 'uuid' })
  paymentTermId: string;

  @Column({ nullable: true, type: 'float' })
  advancePayment: number;

  @Column({ nullable: true, type: 'float' })
  totalPrice: number;

  @Column()
  status: LoadStatus;
}
