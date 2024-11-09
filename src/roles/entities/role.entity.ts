import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";

@Entity({ name: 'roles' })
export class RolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[]
}