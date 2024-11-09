import { CompanyEntity } from '../companies';
import { ProjectEntity } from '../projects';
import { UserEntity } from '../users';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatusEntity } from './task-status.entity';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => TaskStatusEntity, (status) => status.tasks, {
    nullable: false,
  })
  @JoinColumn({ name: 'status', referencedColumnName: 'id' })
  status: TaskStatusEntity;

  @ManyToOne(() => UserEntity, (users) => users.createdTasks, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_user_id', referencedColumnName: 'id' })
  createdByUser: UserEntity;

  @ManyToOne(() => UserEntity, (users) => users.appointedTasks, {
    nullable: false,
  })
  @JoinColumn({ name: 'appointed_to_user', referencedColumnName: 'id' })
  appointedToUser: UserEntity;

  @ManyToOne(() => ProjectEntity, (projects) => projects.tasks, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: ProjectEntity;

  @ManyToOne(() => CompanyEntity, (companies) => companies.tasks, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: CompanyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
