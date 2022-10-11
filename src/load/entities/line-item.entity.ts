import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlatformEntity } from '../../common/platform.entity';
import { Load } from './load.entity';
import { UnitOfMeasurement } from '../constant';

@Entity('line_item')
export class LineItem extends PlatformEntity {
  @ManyToOne(
    () => Load,
    load => load.lineItems,
  )
  @JoinColumn({ name: 'load_id', referencedColumnName: 'id' })
  load: Load;

  @Column()
  loadId: string;

  @Column()
  productName: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  uom?: UnitOfMeasurement;

  @Column({ nullable: true, type: 'float' })
  value?: number;
}
