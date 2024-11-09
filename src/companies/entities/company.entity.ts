import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";
import { TaskEntity } from "src/tasks/entities/task.entity";
import { ProjectEntity } from "src/projects/entities/project.entity";

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

  @OneToMany(() => UserEntity, (user) => user.company)
  @JoinColumn()
  users: UserEntity[]

  @OneToMany(() => ProjectEntity, (project) => project.company)
  @JoinColumn()
  projects: ProjectEntity[]

  @OneToMany(() => TaskEntity, (task) => task.company)
  @JoinColumn()
  tasks: TaskEntity[]
}