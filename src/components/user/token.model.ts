import { Entity, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import User from "./user.model";

@Entity({ schema: "public" })
export default class Token extends BaseEntity {
  @PrimaryColumn()
  token!: string;

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: "CASCADE",
  })
  user!: User;

  constructor(init?: Partial<Token>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }
}
