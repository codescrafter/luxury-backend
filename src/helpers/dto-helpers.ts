import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const phoneValidationRegex = /^\+[1-9]\d{1,14}$/;
export const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@ValidatorConstraint({ name: 'emailOrPhone', async: false })
export class IsEmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return emailValidationRegex.test(value) || phoneValidationRegex.test(value);
  }
  defaultMessage(args: ValidationArguments) {
    return 'The value must be a valid email address or phone number.';
  }
}
