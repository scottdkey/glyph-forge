import { OpenAPIV3 } from 'openapi-types';
import { zodSchemaGenerator } from './zodSchema.generator.js';

export function responseSchemaGenerator(
  operation: OpenAPIV3.OperationObject,
  components: OpenAPIV3.ComponentsObject | undefined,
): string {
  const successResponse = Object.entries(operation.responses).find(([code]) =>
    code.startsWith('2'),
  );
  if (!successResponse) {
    return 'z.unknown()';
  }

  const [, response] = successResponse;
  if ('$ref' in response) {
    const refName = response.$ref.split('/').pop();
    return `SchemaRefs['${refName}']`;
  }

  const content = response.content?.['application/json'];
  if (!content || !content.schema) {
    return 'z.unknown()';
  }

  // Extract enums from components
  const enums: Record<string, string[]> = {};
  if (components && components.schemas) {
    for (const [name, schema] of Object.entries(components.schemas)) {
      if (
        typeof schema === 'object' &&
        'type' in schema &&
        schema.type === 'string' &&
        schema.enum
      ) {
        enums[name] = schema.enum;
      }
    }
  }

  const schemaName = `Response${operation.operationId || ''}`;
  return zodSchemaGenerator(content.schema, schemaName, enums);
}
