import { registerDecorator } from 'class-validator';

export function ContainAlpha() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ContainAlpha',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: { message: `${propertyName} must contain at least 1 letter.` },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /[A-Za-z]/.test(value);
        },
      },
    });
  };
}
