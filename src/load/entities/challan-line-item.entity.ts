import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlatformEntity } from '../../common/platform.entity';
import { UnitOfMeasurement } from '../constant';
import { Challan } from './challan.entity';
import { Load } from './load.entity';

@Entity('challan_line_item')
export class ChallanLineItem extends PlatformEntity {
  @ManyToOne(
    () => Challan,
    challan => challan.challanLineItems,
  )
  @JoinColumn({ name: 'challan_id', referencedColumnName: 'id' })
  challan: Challan;

  @Column()
  challanId: string;

  @Column()
  productName: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  uom?: UnitOfMeasurement;

  @Column({ nullable: true, type: 'float' })
  value?: number;
}
