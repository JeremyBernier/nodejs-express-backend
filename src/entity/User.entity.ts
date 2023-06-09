import { GlobalRole } from "../types/GlobalRole";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import * as argon2 from "argon2";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import Post from "./Post.entity";

registerEnumType(GlobalRole, {
  name: "GlobalRole",
  description:
    "Global user account permissions (not to be confused with permissions tied to an organization)",
});

@ObjectType()
@Entity()
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  @ValidateIf((user: User) => user.email == null)
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  @ValidateIf((user: User) => user.username == null)
  @IsEmail()
  // @IsNotEmpty()
  email?: string;

  // @Authorized("ADMIN")
  @Column("text", { nullable: true })
  // @IsString()
  // @MinLength(8)
  // @MaxLength(40)
  password?: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await argon2.hash(this.password, { hashLength: 12 });
    }
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: false })
  @Column({ nullable: false, default: false })
  emailVerified: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tempLoginToken?: string;

  @Field((type) => GlobalRole, { nullable: true })
  @Column("smallint", { nullable: true })
  role?: number;

  @Field(() => Post)
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return {
      ...this,
      password: undefined,
      email: undefined,
    };
  }
}
