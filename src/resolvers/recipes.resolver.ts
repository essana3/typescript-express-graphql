import { ObjectId } from 'mongodb';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';

import { Context, RecipeArgs, RecipeUpdateArgs } from '../types';

import { RecipesService, UsersService } from '../services';

import { Recipe, RecipeDocument, User } from '../models';

@Resolver(() => Recipe)
export default class RecipesResolver {
  @Authorized()
  @Query(() => Recipe, { nullable: true })
  async recipe(@Arg('id') id: string): Promise<RecipeDocument | null> {
    return RecipesService.findOne(id);
  }

  @Authorized()
  @Query(() => [Recipe])
  async recipes(): Promise<RecipeDocument[]> {
    return RecipesService.find();
  }

  @Authorized()
  @Mutation(() => Recipe)
  async createRecipe(
    @Args() recipeInput: RecipeArgs,
    @Ctx() { user }: Context
  ): Promise<RecipeDocument> {
    return RecipesService.create({ ...recipeInput, author: user._id });
  }

  @Authorized()
  @Mutation(() => Recipe, { nullable: true })
  async updateRecipe(
    @Args() recipeInput: RecipeUpdateArgs,
    @Ctx() { user }: Context
  ): Promise<RecipeDocument | null> {
    const recipe = await RecipesService.findOne(recipeInput._id);

    if (recipe) {
      if ((recipe.author as ObjectId).equals(user._id)) {
        return RecipesService.update({ _id: recipeInput._id }, recipeInput);
      }
      throw new Error('You are not authorized to edit this recipe');
    }

    throw new Error('Recipe not found');
  }

  @Authorized()
  @Mutation(() => Recipe, { nullable: true })
  async deleteRecipe(
    @Arg('id') id: string,
    @Ctx() { user }: Context
  ): Promise<RecipeDocument | null> {
    const recipe = await RecipesService.findOne(id);

    if (recipe) {
      if ((recipe.author as ObjectId).equals(user._id)) {
        return RecipesService.delete(id);
      }
      throw new Error('You are not authorized to delete this recipe');
    }

    throw new Error('Recipe not found');
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe): Promise<User | null> {
    return UsersService.findOne({ _id: recipe.author });
  }
}
