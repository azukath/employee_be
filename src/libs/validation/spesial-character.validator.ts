import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

@ValidatorConstraint({ name: 'validationString', async: false })
export class ValidateSpesialCharacter implements ValidatorConstraintInterface {
  validate(text: string) {
    return !specialChars.test(text);
  }

  defaultMessage() {
    return 'Text ($value) contains special character!';
  }
}
