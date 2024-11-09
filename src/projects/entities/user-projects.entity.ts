import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";
import { ProjectEntity } from "./project.entity";

@Entity({ name: "user_projects" })
export class UserProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  project_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: UserEntity[];

  @ManyToOne(() => ProjectEntity)
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  companies: ProjectEntity[];
}