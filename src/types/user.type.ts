import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { IsEmailExists } from '../validators/user.validator';

@InputType()
export class RegisterInput {
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

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @IsEmailExists(true, { message: 'user does not exist' })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
