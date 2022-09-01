import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlatformEntity } from '../../common/platform.entity';
import { Load } from './load.entity';
import { AdditionalMeasureUOM, WeightUnit } from '../constant';

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

  @Column()
  sku: string;

  @Column({ nullable: true, type: 'float' })
  weight: number;

  @Column({ nullable: true })
  weightUnit: WeightUnit;

  @Column({ nullable: true })
  additionalMeasureUOM?: AdditionalMeasureUOM;

  @Column({ nullable: true, type: 'float' })
  additionalMeasureValue?: number;
}
