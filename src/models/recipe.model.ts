import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop as Property,
  Ref
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';

import { User } from './user.model';

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
export class Recipe {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  title: string;

  @Field()
  @Property({ required: true })
  description: string;

  @Field(() => User)
  @Property({ ref: User, required: true })
  author: Ref<User>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type RecipeDocument = DocumentType<Recipe>;

export const RecipeModel = getModelForClass(Recipe);
