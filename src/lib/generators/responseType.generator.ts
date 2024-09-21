import { OpenAPIV3 } from 'openapi-types';

export function generateResponseType(
  responses: OpenAPIV3.ResponsesObject,
  components: OpenAPIV3.ComponentsObject | undefined,
): string {
  const successResponse = responses['200'] || responses['201'];
  if (successResponse && 'content' in successResponse) {
    const content = successResponse.content?.['application/json'];
    if (content && content.schema) {
      return generateSchemaType(content.schema, components);
    }
  }
  return 'any';
}

function generateSchemaType(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  components: OpenAPIV3.ComponentsObject | undefined,
): string {
  if ('$ref' in schema) {
    const refName = schema.$ref.split('/').pop();
    return `SchemaRefs['${refName}']`;
  }

  if (schema.type === 'object' && schema.properties) {
    const props = Object.entries(schema.properties)
      .map(([key, value]) => {
        return `${key}: ${generateSchemaType(value as OpenAPIV3.SchemaObject, components)}`;
      })
      .join(', ');
    return `{ ${props} }`;
  }

  if (schema.type === 'array' && schema.items) {
    return `Array<${generateSchemaType(schema.items as OpenAPIV3.SchemaObject, components)}>`;
  }

  return schema.type || 'any';
}
