import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { REQUEST_CONTEXT } from "src/shared/interceptors/inject-user.interceptor";
import { ExtendedValidationArguments } from "src/shared/models/extended-validation-arguments.model";
import { DataSource } from "typeorm";

@ValidatorConstraint({ name: 'isExistsRule'})
@Injectable()
export class IsExistsRule implements ValidatorConstraintInterface {

    msg?: string;

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) { }

    async validate(value: string, validationArguments: ExtendedValidationArguments) {
        const validAuthUser = validationArguments.constraints[2];
        const fieldName = validationArguments.constraints[3];
        const paramId = validAuthUser ? validationArguments.object[REQUEST_CONTEXT]?.user : validationArguments.object[REQUEST_CONTEXT]?.dataId;
        const connect = this.dataSource.getRepository(validationArguments.constraints[0])
                            .createQueryBuilder("data")
                            .select();
                            
        if (paramId) {
            return connect.where(`data.id = :val`, { val: paramId }).getOneOrFail().then((currentData) => {
                if (currentData[validationArguments.property] !== value) {
                    return connect.where(`data.${validationArguments.property} = :val`, { val: value.trim() }).getOne().then((findData) => {
                        return findData ? false : true;
                    }).catch(() => { return false; });
                }else{
                    return true;
                }
            }).catch(() => { return false; });
        }else{
            this.msg = `La valeur du champ ${validationArguments.constraints[1]} est introuvable.`
            return connect.where(`data.${fieldName ?? validationArguments.property} = :val`, { val: value.trim() }).getOneOrFail().then(() => {
                return true;
            }).catch(() => { return false; });
        }
    }

    defaultMessage(args: ValidationArguments) {
        return this.msg ?? `La valeur du champ ${args.constraints[1]} a déjà été ajoutée.`;
    }
}

export function IsExists(
    a: any,
    fieldLabel: string,
    authUser?: boolean,
    fieldName?: string,
    validationOptions?: ValidationOptions
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [a, fieldLabel, authUser, fieldName],
            validator: IsExistsRule,
        });
    };
}