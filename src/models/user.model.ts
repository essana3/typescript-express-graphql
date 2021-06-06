import argon2, { argon2id } from 'argon2';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop as Property
} from '@typegoose/typegoose';

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
@pre<User>('save', async function (this: UserDocument) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password, { type: argon2id });
  }
})
export class User {
  @Field()
  readonly _id: ObjectId;

  get id(): string {
    return this._id.toHexString();
  }

  @Field()
  @Property({ required: true, trim: true })
  firstName!: string;

  @Field()
  @Property({ required: true, trim: true })
  lastName!: string;

  @Field()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field()
  @Property({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Property({ required: true, select: false })
  password!: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  comparePassword(this: UserDocument, password: string): Promise<boolean> {
    return argon2.verify(this.password, password, { type: argon2id });
  }

  generateToken(this: UserDocument): string {
    const payload = this.toJSON();
    delete payload.password;

    return jwt.sign(payload, environment.jwt.secret, {
      algorithm: 'HS512',
      issuer: environment.jwt.issuer
    });
  }
}

export type UserDocument = DocumentType<User>;

export const UserModel = getModelForClass(User);
