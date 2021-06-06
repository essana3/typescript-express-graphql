import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { UsersService } from '../services';

@ValidatorConstraint({ async: true })
class IsEmailExistsConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: any): Promise<boolean> {
    return UsersService.findOne({ email }).then((user) => !!user === args.constraints[0]);
  }
}

export function IsEmailExists(exists: boolean, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [exists],
      validator: IsEmailExistsConstraint
    });
  };
}
