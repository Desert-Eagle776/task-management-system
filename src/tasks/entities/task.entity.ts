import { CompanyEntity } from "src/companies/entities/company.entity";
import { ProjectEntity } from "src/projects/entities/project.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatusEntity } from "./task-status.entity";

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => TaskStatusEntity, status => status.tasks, { nullable: false })
  @JoinColumn({ name: 'status', referencedColumnName: 'id' })
  status: TaskStatusEntity;

  @ManyToOne(() => UserEntity, users => users.createdTasks, { nullable: false })
  @JoinColumn({ name: 'created_user_id', referencedColumnName: 'id' })
  createdByUser: UserEntity;

  @ManyToOne(() => UserEntity, users => users.appointedTasks, { nullable: false })
  @JoinColumn({ name: 'appointed_user_id', referencedColumnName: 'id' })
  appointedToUser: UserEntity;

  @ManyToOne(() => ProjectEntity, projects => projects.tasks, { nullable: false })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: ProjectEntity;

  @ManyToOne(() => CompanyEntity, companies => companies.tasks, { nullable: false })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: CompanyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}