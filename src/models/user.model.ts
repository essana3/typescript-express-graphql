import argon2, { argon2id } from 'argon2';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, modelOptions, pre, prop as Property } from '@typegoose/typegoose';

// Load environment
import environment from '../config/environment';

@ObjectType()
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
})
@pre<User>('save', async function () {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password, { type: argon2id });
  }
})
export class User {
  @Field(() => ID)
  readonly _id: Types.ObjectId;

  @Field()
  @Property({ required: true, trim: true })
  firstName!: string;

  @Field()
  @Property({ required: true, trim: true })
  lastName!: string;

  @Field()
  @Property({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Property({ required: true, select: false })
  password!: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  comparePassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password, { type: argon2id });
  }

  generateToken(): string {
    return jwt.sign({ ...this }, environment.jwt.secret, {
      algorithm: 'HS512',
      issuer: environment.jwt.issuer
    });
  }
}

export default getModelForClass(User);
