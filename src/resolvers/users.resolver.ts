import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Context, LoginData, LoginArgs, RegisterArgs, UserArgs } from '../types';

import { UsersService } from '../services';

import { User, UserDocument } from '../models';

@Resolver(() => User)
export default class UsersResolver {
  @Mutation(() => LoginData)
  async register(@Args() input: RegisterArgs): Promise<LoginData> {
    const user = await UsersService.create(input);
    const token = user.generateToken();

    return { user, token };
  }

  @Query(() => LoginData, { nullable: true })
  async login(@Args() { email, password }: LoginArgs): Promise<LoginData> {
    const user = await UsersService.findOne({ email }).select('+password');

    if (user) {
      const valid = await user.comparePassword(password);

      if (valid) {
        const token = user.generateToken();

        return { user, token };
      }
    }

    throw new Error('user does not exist');
  }

  @Authorized()
  @Query(() => [User])
  async users(): Promise<UserDocument[]> {
    return UsersService.find();
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async user(@Arg('id') _id: string): Promise<UserDocument | null> {
    return UsersService.findOne({ _id });
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args() input: UserArgs,
    @Ctx() { user }: Context
  ): Promise<UserDocument | null> {
    return UsersService.update({ _id: user._id }, input);
  }
}
