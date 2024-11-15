import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, type: "varchar", length: 48 })
  email!: string;

  @Column({ length: 16, type: "varchar" })
  username!: string;

  @Column({ length: 60, type: "varchar" })
  password!: string;

  @Column({ type: "date" })
  dateOfBirth!: string;

  @Column({ type: "float" })
  height!: number;

  @Column({ type: String })
  refreshToken!: string;
}
