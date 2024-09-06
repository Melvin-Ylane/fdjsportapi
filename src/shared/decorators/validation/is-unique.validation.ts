import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { DataSource } from "typeorm";

@ValidatorConstraint({ name: 'isUniqueRule' })
@Injectable()
export class IsUniqueRule implements ValidatorConstraintInterface {

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) { }

    async validate(value: string, validationArguments: ValidationArguments) {
        const connect = this.dataSource.getRepository(validationArguments.constraints[0])
                            .createQueryBuilder("data")
                            .select();
        const fieldName = validationArguments.constraints[2];

        return connect.where(`data.${fieldName ?? validationArguments.property} = :val`, { val: value.trim() }).getOne().then((findData) => {
            return findData ? false : true;
        }).catch(() => { return false; });
    }

    defaultMessage(args: ValidationArguments) {
        return `La valeur du champ ${args.constraints[1]} a déjà été ajoutée.`;
    }
}

export function IsUnique(a: any, fieldLabel: string,  fieldName?: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [a, fieldLabel, fieldName],
            validator: IsUniqueRule,
        });
    };
}