import { registerDecorator } from 'class-validator';

export function ContainNumber() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ContainNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: { message: `${propertyName} must contain at least 1 number.` },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /\d/.test(value);
        },
      },
    });
  };
}
