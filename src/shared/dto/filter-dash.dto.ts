import { IsOptional, IsUUID } from "class-validator";

export class FilterDashDto {
    @IsOptional()
    @IsUUID()
    school?: string;
    @IsOptional()
    @IsUUID()
    schoolyear?: string;
}
