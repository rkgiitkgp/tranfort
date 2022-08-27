import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PlatformEntity } from '../../common/platform.entity';


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
  type: string;

  @BeforeInsert()
  async emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.password = await bcrypt.hash(this.password, 12);
  }
}
