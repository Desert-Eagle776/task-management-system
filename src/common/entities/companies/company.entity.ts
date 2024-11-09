import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users';
import { TaskEntity } from '../tasks';
import { ProjectEntity } from '../projects';
import { PlanType } from 'src/common/constants/companies.constants';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  secret_key: string;

  @Column({ type: 'enum', enum: PlanType, default: PlanType.FREE })
  planType: PlanType;

  @OneToMany(() => UserEntity, (user) => user.company)
  @JoinColumn()
  users: UserEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.company)
  @JoinColumn()
  projects: ProjectEntity[];

  @OneToMany(() => TaskEntity, (task) => task.company)
  @JoinColumn()
  tasks: TaskEntity[];
}
