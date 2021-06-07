import { ObjectId } from 'mongodb';
import { FilterQuery, QueryFindOptions, Query } from 'mongoose';

import { RecipeArgs, RecipeInput } from '../types';

import { RecipeDocument, RecipeModel } from '../models';

export default class RecipesService {
  static create(input: RecipeInput): Promise<RecipeDocument> {
    return RecipeModel.create<RecipeInput>(input);
  }

  static find(
    query: FilterQuery<RecipeDocument> = {},
    options: QueryFindOptions = { lean: true }
  ): Query<RecipeDocument[]> {
    return RecipeModel.find(query, null, options).sort({ createdAt: -1 });
  }

  static findOne(id: ObjectId | string): Query<RecipeDocument | null> {
    return RecipeModel.findById(id);
  }

  static update(
    query: FilterQuery<RecipeDocument>,
    input: RecipeArgs
  ): Query<RecipeDocument | null> {
    return RecipeModel.findOneAndUpdate(query, input, { new: true });
  }

  static delete(id: ObjectId | string): Query<RecipeDocument | null> {
    return RecipeModel.findByIdAndDelete(id);
  }
}
