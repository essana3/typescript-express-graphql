import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '../models/user.model';

import { LoginData, LoginInput, RegisterInput } from '../types/user.type';

import UsersService from '../services/users.service';

@Resolver()
export default class UsersResolver {
  @Authorized()
  @Query()
  hello(): string {
    return 'Hello World!';
  }

  @Mutation(() => LoginData)
  async register(@Arg('input') input: RegisterInput): Promise<LoginData> {
    const user = await UsersService.create(input);
    const token = user.generateToken();

    return { user, token };
  }

  @Query(() => LoginData, { nullable: true })
  async login(@Arg('input') { email, password }: LoginInput): Promise<LoginData> {
    const user = await UsersService.findOne({ email }).select('+password');

    if (user) {
      const valid = await user.comparePassword(user.password, password);

      if (valid) {
        const token = user.generateToken();
        return { user, token };
      }
    }

    throw new Error('user does not exist');
  }
}
