import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty } from 'class-validator';
import { BaseDto } from 'src/shared/dto/base.dto';

export class FilterTeamDto extends PartialType(BaseDto) {
    @IsEmpty()
    id?: string;
}
