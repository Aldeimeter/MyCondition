import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  Entity,
} from "typeorm";
import Method from "../method/method.model";
import User from "@components/user/user.model";
@Entity({ schema: "public" })
export default class Weight extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "float" })
  value!: number;

  @ManyToOne(() => Method, (method) => method.id)
  method?: string;

  @ManyToOne(() => User, (user) => user.id)
  user!: string;
  constructor(init?: Partial<Weight>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }
}
