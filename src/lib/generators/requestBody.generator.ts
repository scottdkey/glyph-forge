import { OpenAPIV3 } from 'openapi-types';

export function requestBodyGenerator(
  requestBody: OpenAPIV3.RequestBodyObject,
  components: OpenAPIV3.ComponentsObject | undefined,
): string {
  const content = requestBody.content['application/json'];
  if (!content || !content.schema) return 'any';

  return schemaTypeGenerator(content.schema, components);
}

function schemaTypeGenerator(
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
        return `${key}: ${schemaTypeGenerator(value as OpenAPIV3.SchemaObject, components)}`;
      })
      .join(', ');
    return `{ ${props} }`;
  }

  if (schema.type === 'array' && schema.items) {
    return `Array<${schemaTypeGenerator(schema.items as OpenAPIV3.SchemaObject, components)}>`;
  }

  return schema.type || 'any';
}
