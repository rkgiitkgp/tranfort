import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 } from 'uuid';
import { BaseEntity as ORMBaseEntity } from 'typeorm';
import { getRequestContext } from './request.context';

export class PlatformEntity extends ORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column()
  public createdAt: Date;
  @Column()
  public updatedAt: Date;
  @Column({ nullable: true, type: 'uuid' })
  public createdBy: string;
  @Column({ nullable: true, type: 'uuid' })
  public updatedBy: string;
  @Column()
  public deleted: boolean;

  @BeforeInsert()
  async populateDetails(): Promise<void> {
    const userContext = await getRequestContext();
    this.id = v4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdBy = userContext.userId;
    this.updatedBy = userContext.userId;
    this.deleted = false;
  }

  @BeforeUpdate()
  async populateUpdateDetails(): Promise<void> {
    const userContext = await getRequestContext();
    this.updatedAt = new Date();
    this.updatedBy = userContext.userId;
  }
}
