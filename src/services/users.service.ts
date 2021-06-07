import { FilterQuery, Query, QueryFindOptions } from 'mongoose';

import { RegisterArgs, UserArgs } from '../types';

import { UserDocument, UserModel } from '../models';

export default class UsersService {
  static create(input: RegisterArgs): Promise<UserDocument> {
    return UserModel.create<RegisterArgs>(input);
  }

  static find(
    query: FilterQuery<UserDocument> = {},
    options: QueryFindOptions = { lean: true }
  ): Query<UserDocument[]> {
    return UserModel.find(query, null, options).sort({ createdAt: -1 });
  }

  static findOne(query: FilterQuery<UserDocument>): Query<UserDocument | null> {
    return UserModel.findOne(query);
  }

  static update(query: FilterQuery<UserDocument>, input: UserArgs): Query<UserDocument | null> {
    return UserModel.findOneAndUpdate(query, input, { new: true });
  }

  static delete(query: FilterQuery<UserDocument>): Query<UserDocument | null> {
    return UserModel.findOneAndDelete(query);
  }
}
