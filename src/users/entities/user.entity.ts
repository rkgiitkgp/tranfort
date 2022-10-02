import { BeforeInsert, Column, Entity, OneToMany, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PlatformEntity } from '../../common/platform.entity';
import { UserType } from '../constant';
import { Load } from '../../load/entities/load.entity';
import { Booking } from '../../load/entities/booking.entity';

@Entity({ name: 'users' })
@Unique(['mobile'])
@Unique(['email'])
export class User extends PlatformEntity {
  @Column()
  name: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ default: '9876543210' })
  mobile: string;
  @Column()
  type: UserType;

  @OneToMany(
    () => Load,
    load => load.user,
  )
  loads: Load[];

  @OneToMany(
    () => Booking,
    booking => booking.user,
  )
  bookings: Booking[];

  @BeforeInsert()
  async emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.password = await bcrypt.hash(this.password, 12);
  }
}
