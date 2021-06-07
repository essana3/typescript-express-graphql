import { IsMongoId, Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ArgsType, Field } from 'type-graphql';

import { Recipe } from '../models';

@ArgsType()
export class RecipeArgs implements Partial<Recipe> {
  @Field()
  @Length(1, 255)
  title: string;

  @Field()
  @Length(6, 1000)
  description: string;
}

@ArgsType()
export class RecipeUpdateArgs extends RecipeArgs {
  @Field()
  @IsMongoId()
  _id: string;
}

export class RecipeInput extends RecipeArgs {
  author: ObjectId;
}
