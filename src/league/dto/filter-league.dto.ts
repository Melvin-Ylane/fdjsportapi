import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/shared/dto/base.dto';

export class FilterLeagueDto extends PartialType(BaseDto) {
    @IsOptional()
    @IsString()
    id?: string;
	@ApiProperty({ required: false })
    @IsOptional()
    @IsString()
	name?: string;
    @IsOptional()
    @IsString()
	sport?: string;
}
