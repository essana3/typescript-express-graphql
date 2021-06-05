import argon2, { argon2id } from 'argon2';
import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, modelOptions, pre, prop as Property } from '@typegoose/typegoose';

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
  readonly _id: string;

  @Field()
  @Property({ required: true, trim: true })
  firstName!: string;

  @Field()
  @Property({ required: true, trim: true })
  lastName!: string;

  @Field()
  @Property({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Property({ required: true })
  password!: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  comparePassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }
}

export default getModelForClass(User);
