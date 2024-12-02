import CustomError from "@config/errors/CustomError";
import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  Entity,
} from "typeorm";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import Token from "./token.model";
import Weight from "@components/measures/weight/weight.model";
import { ROLES } from "./constants";

@Entity({ schema: "public" })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, type: "varchar", length: 48 })
  email!: string;

  @Column({ length: 16, type: "varchar" })
  username!: string;

  @Column({ length: 60, type: "varchar" })
  password!: string;

  // Hook to hash password before saving or updating
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({
    type: "enum",
    enum: ROLES,
    default: ROLES.User,
  })
  role!: ROLES;

  @Column({ type: "int8" })
  age!: number;

  @Column({ type: "float" })
  height!: number;

  @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens!: Token[];

  @OneToMany(() => Weight, (weight) => weight.user, { cascade: true })
  weights!: Weight[];

  constructor(init?: Partial<User>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }

  toJSON() {
    const { password, tokens, ...userData } = this;
    return userData;
  }

  toCSV() {
    const { email, password, username, age, height } = this;
    return `${email},${username},${password},${age},${height}`;
  }

  static fromCSV(line: string) {
    const [email, password, username, age, height] = line.split(",");
    return new this({
      email,
      password,
      username,
      age: Number(age),
      height: Number(height),
    });
  }

  static async findByCredentials(email: string, password: string) {
    const user = await this.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new CustomError(
        "Wrong credentials",
        400,
        "Email or password is wrong!",
      );
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new CustomError(
        "Wrong credentials",
        400,
        "Email or password is wrong!",
      );
    }
    return user;
  }

  generateAccessToken(): string {
    const accessToken = jwt.sign(
      {
        id: this.id.toString(),
        username: this.username,
        email: this.email,
        role: this.role,
      },
      ACCESS_TOKEN.secret,
      {
        expiresIn: ACCESS_TOKEN.expiry,
      },
    );
    return accessToken;
  }

  async generateRefreshToken(): Promise<string> {
    // Create signed refresh token
    const refreshToken = jwt.sign(
      {
        id: this.id.toString(),
      },
      REFRESH_TOKEN.secret,
      {
        expiresIn: REFRESH_TOKEN.expiry,
      },
    );

    // Create a 'refresh token hash' from 'refresh token'
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");

    // Find the user

    // Create a new Token entity
    const token = new Token({ token: rTknHash, user: this });
    await token.save();
    await this.save();

    return refreshToken;
  }
}
