import { OpenAPIV3 } from 'openapi-types';
import { zodSchemaGenerator } from './zodSchema.generator.js';

export function generateBody(operation: OpenAPIV3.OperationObject): string {
  if (!operation.requestBody) {
    return '';
  }

  const requestBody = 'content' in operation.requestBody ? operation.requestBody : { content: {} }; // Handle $ref case

  const jsonContent = requestBody.content?.['application/json'];
  if (!jsonContent || !jsonContent.schema) {
    return '';
  }

  const bodySchema = zodSchemaGenerator(jsonContent.schema);
  return `body: JSON.stringify(${bodySchema}.parse(body)),`;
}
