import { BadRequestException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
import { ValidationError, validate } from 'class-validator';

export const MIN_PAGE: number = 1;
export const MIN_SIZE: number = 50;

export const checkPageAndSize = <T>(dto: T) => {
    if(!dto['page']) dto['page'] = MIN_PAGE;
    if(!dto['size']) dto['size'] = MIN_SIZE;
    return dto;
}

/* export const hashData = async (data: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
} */

export const validateDtoByClassValidator = async <T>(obj: T) => {
    const errors = await validate(obj as object);
    let e: string[] = [];
    if (errors.length > 0){
        e = getAllErrors(e, errors);
    }else{
        return true;
    }
    throw new BadRequestException(e);
}

const getAllErrors = (e: string[], errors: ValidationError[]) => {
    if (errors.length > 0){
        errors.forEach(element => {
            if (element.children.length > 0) {
                e = getAllErrors(e, element.children);
            }else{
                e = e.concat(Object.values(element.constraints));
            }
        });
    }
    return e;
}