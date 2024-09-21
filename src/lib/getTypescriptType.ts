import { OpenAPIV3 } from 'openapi-types';

export function getTypeScriptType(schema: OpenAPIV3.SchemaObject): string {
  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return `Array<${getTypeScriptType(schema.items as OpenAPIV3.SchemaObject)}>`;
    case 'object':
      return '{ [key: string]: any }';
    default:
      return 'any';
  }
}
