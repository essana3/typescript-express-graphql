import { FilterQuery, Query, QueryFindOptions } from 'mongoose';

import UserModel, { User } from '../models/user.model';

import { RegisterInput } from '../types/user.type';

export default class UsersService {
  static create(input: RegisterInput): Promise<User> {
    return UserModel.create<RegisterInput>(input);
  }

  static find(query: FilterQuery<User>, options: QueryFindOptions = { lean: true }): Query<User[]> {
    return UserModel.find(query, null, options).sort({ createdAt: -1 });
  }

  static findOne(query: FilterQuery<User>): Query<User | null> {
    return UserModel.findOne(query);
  }

  static update(query: FilterQuery<User>, input: Partial<RegisterInput>): Query<User | null> {
    return UserModel.findOneAndUpdate(query, input, { new: true });
  }

  static delete(query: FilterQuery<User>): Query<User | null> {
    return UserModel.findOneAndDelete(query);
  }
}
