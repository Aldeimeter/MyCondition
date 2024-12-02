import { PrimaryGeneratedColumn, Column, BaseEntity, Entity } from "typeorm";

@Entity({ schema: "public" })
export default class Advertisement extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 2048, type: "varchar" })
  imgUrl!: string;

  @Column({ length: 2048, type: "varchar" })
  targetUrl!: string;

  @Column({ type: "int" })
  counter!: number;

  @Column({ type: "boolean" })
  isActive!: boolean;

  constructor(init?: Partial<Advertisement>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }
}
