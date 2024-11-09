import { UserEntity } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CompanyEntity } from "./company.entity";

@Entity({ name: "users_companies" })
export class UserCompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  company_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: UserEntity[];

  @ManyToOne(() => CompanyEntity)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  companies: CompanyEntity[];
}