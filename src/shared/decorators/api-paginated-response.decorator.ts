import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { Pagination } from "../models/pagination.model";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model: TModel,
    description: string
  ) => {
    return applyDecorators(
      ApiExtraModels(Pagination, model),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(Pagination) },
            {
              properties: {
                datas: {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                },
              },
            },
          ],
        },
        description
      }),
    );
  };