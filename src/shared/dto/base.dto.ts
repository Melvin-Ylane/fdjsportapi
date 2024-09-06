import { Type } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, MaxLength } from "class-validator";
import { FilterOption } from "../models/filter-option.model";
import { ApiProperty } from "@nestjs/swagger";

export class BaseDto {
    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
	@ApiProperty({ required: false })
    page: number;
    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @Max(100)
    @Type(() => Number)
	@ApiProperty({ required: false })
    size: number;
    // @IsEmpty()
    filter_options: FilterOption[] = [];
}