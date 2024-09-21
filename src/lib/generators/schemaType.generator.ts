import { OpenAPIV3 } from 'openapi-types';

export function schemaTypeGenerator(schema: OpenAPIV3.SchemaObject): string {
  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return `Array<${schemaTypeGenerator(schema.items as OpenAPIV3.SchemaObject)}>`;
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, value]) => `${key}: ${schemaTypeGenerator(value as OpenAPIV3.SchemaObject)}`)
          .join(', ');
        return `{ ${props} }`;
      }
      return 'Record<string, any>';
    default:
      return 'any';
  }
}
