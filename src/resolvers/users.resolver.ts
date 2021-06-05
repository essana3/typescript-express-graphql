import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '../models/user.model';

import { LoginInput, RegisterInput } from '../types/user.type';

import UsersService from '../services/users.service';

@Resolver(() => User)
export default class UsersResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterInput): Promise<User> {
    return UsersService.create(input);
  }

  @Query(() => User, { nullable: true })
  async login(@Arg('input') { email, password }: LoginInput): Promise<User | null> {
    const user = await UsersService.findOne({ email });

    const valid = await user?.comparePassword(password);

    if (valid) {
      return user;
    }

    throw new Error('user does not exist');
  }
}
