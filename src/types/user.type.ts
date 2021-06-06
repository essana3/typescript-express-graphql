import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ArgsType, Field, ObjectType } from 'type-graphql';

import { IsEmailExists } from '../validators';

import { User, UserDocument } from '../models';

// @InputType()
@ArgsType()
export class UserArgs implements Partial<User> {
  @Field({ nullable: true })
  @Length(1, 255)
  firstName: string;

  @Field({ nullable: true })
  @Length(1, 255)
  lastName: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  password: string;
}

@ArgsType()
export class RegisterArgs implements Partial<User> {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailExists(false, { message: 'email exists already' })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@ArgsType()
export class LoginArgs implements Partial<User> {
  @Field()
  @IsEmail()
  @IsEmailExists(true, { message: 'user does not exist' })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class LoginData {
  @Field()
  user: User;

  @Field()
  token: string;
}
