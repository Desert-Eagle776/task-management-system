import { CompanyEntity } from '../companies';
import { RolesEntity } from '../roles';
import { TaskEntity } from '../tasks';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  token: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @ManyToOne(() => RolesEntity, (roles) => roles.users)
  @JoinColumn({ name: 'role', referencedColumnName: 'id' })
  roles: RolesEntity;

  @ManyToOne(() => CompanyEntity, (companies) => companies.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: CompanyEntity;

  @OneToMany(() => TaskEntity, (tasks) => tasks.createdByUser)
  @JoinColumn()
  createdTasks: TaskEntity[];

  @OneToMany(() => TaskEntity, (tasks) => tasks.appointedToUser)
  @JoinColumn()
  appointedTasks: TaskEntity[];
}
