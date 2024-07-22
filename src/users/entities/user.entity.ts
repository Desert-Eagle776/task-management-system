import { CompanyEntity } from "src/companies/entities/company.entity";
import { RolesEntity } from "src/roles/entities/role.entity";
import { TaskEntity } from "src/tasks/entities/task.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  token: string;

  @ManyToOne(() => RolesEntity, (roles) => roles.users)
  @JoinColumn({ name: 'role', referencedColumnName: 'id' })
  roles: RolesEntity;

  @ManyToOne(() => CompanyEntity, (companies) => companies.users, { nullable: true })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: CompanyEntity;

  @OneToMany(() => TaskEntity, (tasks) => tasks.createdByUser)
  @JoinColumn()
  createdTasks: TaskEntity[]

  @OneToMany(() => TaskEntity, (tasks) => tasks.appointedToUser)
  @JoinColumn()
  appointedTasks: TaskEntity[];
}