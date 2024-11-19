import { PrimaryGeneratedColumn, Column, BaseEntity, Entity } from "typeorm";

@Entity({ schema: "public" })
export default class Method extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 48, type: "varchar" })
  name!: string;

  @Column({ length: 1024, type: "varchar" })
  description!: string;

  constructor(init?: Partial<Method>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }
}
