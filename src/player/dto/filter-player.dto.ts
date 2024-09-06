import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/shared/dto/base.dto';

export class FilterPlayerDto extends PartialType(BaseDto) {
    @IsEmpty()
    id?: string;
}
