import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

export function IsValidDate(fieldLabel: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [fieldLabel],
            validator: IsValidDateConstraint,
        });
    };
}

@ValidatorConstraint({name: 'IsValidDate'})
export class IsValidDateConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!value.match(regEx)) return false;  // Invalid format
        var d = new Date(value);
        var dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === value;
    }

    defaultMessage(args: ValidationArguments) {
      const [fieldLabel] = args.constraints;
      return `Le champ ${fieldLabel} n'est pas une date valide`;
    }
}