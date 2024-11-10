import { ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface CommonResponseType<T = undefined> {
  success: boolean;
  data: T;
  meta: undefined;
  message: string;
}

export const ApiResponse = <TModel extends Type<unknown>>({
  model,
  type,
  description,
}: {
  model: TModel;
  type: 'object' | 'array' | 'string';
  description: string;
}) => {
  const modelRef = getSchemaPath(model);

  let data: SchemaObject | ReferenceObject = {
    type: type,
    $ref: modelRef,
  };

  if (type === 'array') {
    data = {
      type: type,
      items: {
        $ref: modelRef,
      },
    };
  }

  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `UserResponseOf${model.name}`,
        description: description,
        allOf: [
          {
            properties: {
              message: {
                type: 'string',
              },
              success: {
                type: 'boolean',
              },
              data,
            },
          },
        ],
      },
    }),
    ApiExtraModels(model),
  );
};
