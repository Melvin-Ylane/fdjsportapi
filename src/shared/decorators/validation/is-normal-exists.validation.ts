import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { DataSource, ObjectLiteral } from "typeorm";

@ValidatorConstraint({ name: 'isNormalExistsRule' })
@Injectable()
export class IsNormalExistsRule implements ValidatorConstraintInterface {

    msg?: string;

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) { }

    async validate(value: any, validationArguments: ValidationArguments) {
        if (value.constructor === Array) {
            return this.makeValidation(value, validationArguments).then((res: ObjectLiteral[]) => {
                return (res.length != value.length) ? false : true;
            }).catch(() => { return false; });
        }else{
            return this.makeValidation(value, validationArguments).then(() => {
                return true;
            }).catch(() => { return false; });
        }
    }

    async makeValidation(value: any, validationArguments: ValidationArguments){
        const fieldName = validationArguments.constraints[2];
        const connect = this.dataSource.getRepository(validationArguments.constraints[0])
                            .createQueryBuilder("data")
                            .select();
                            
        const moreConditions = validationArguments.constraints[3];
        const op1 = value.constructor === Array ? 'IN (:...val)' : '= :val';
        let query = connect.where(`data.${fieldName} ${op1}`, { val: value });

        if (moreConditions) {
            for (const key in moreConditions) {
                const element = moreConditions[key];
                const operator = element.constructor == Array ? 'IN (:...val)' : '= :val';
                query = query.andWhere(`data.${key} ${operator}`, { val: element })
            }
        }
        
        return value.constructor === Array ? query.getMany() : query.getOneOrFail();
    }

    defaultMessage(args: ValidationArguments) {
        return this.msg ?? `La valeur du champ ${args.constraints[1]} est introuvable.`;
    }
}

export function IsNormalExists(
    a: any,
    fieldLabel: string,
    fieldName: string,
    moreConditions?: any,
    validationOptions?: ValidationOptions
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsNormalExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [a, fieldLabel, fieldName, moreConditions],
            validator: IsNormalExistsRule,
        });
    };
}