import { CompanyEntity } from "src/companies/entities/company.entity";
import { TaskEntity } from "src/tasks/entities/task.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, user => user.createdTasks)
  @JoinColumn({ name: 'created_user_id', referencedColumnName: 'id' })
  createdByUser: UserEntity;

  @ManyToOne(() => CompanyEntity, company => company.projects)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: CompanyEntity;

  @OneToMany(() => TaskEntity, (task) => task.project)
  @JoinColumn()
  tasks: TaskEntity[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}