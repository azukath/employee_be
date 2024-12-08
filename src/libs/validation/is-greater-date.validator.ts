import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsGreaterDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          if (object.startDate && value) {
            return new Date(value) >= new Date(object.startDate);
          }
          return true;
        },
        defaultMessage() {
          return 'endDate must be greater than or equal to startDate';
        },
      },
    });
  };
}
