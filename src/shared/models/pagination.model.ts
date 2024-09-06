import { ApiProperty } from "@nestjs/swagger";

export class Pagination<T> {
    @ApiProperty({ type: 'array'})
    datas: T[];
    @ApiProperty()
    totalRows: number;
}
