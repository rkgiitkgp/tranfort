import { PlatformEntity } from '../../common/platform.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('payment_term')
@Unique(['name'])
export class PaymentTerm extends PlatformEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  dueDate: number;

  @Column()
  type: string;
}
