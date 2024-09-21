import { OpenAPIV3 } from 'openapi-types';

export function openApiSchemaToZod(schema: OpenAPIV3.SchemaObject): string {
  if (schema.type === 'object' && schema.properties) {
    const properties = Object.entries(schema.properties).map(([key, value]) => {
      return `${key}: ${openApiSchemaToZod(value as OpenAPIV3.SchemaObject)}`;
    });
    return `z.object({ ${properties.join(', ')} })`;
  } else if (schema.type === 'array' && schema.items) {
    return `z.array(${openApiSchemaToZod(schema.items as OpenAPIV3.SchemaObject)})`;
  } else if (schema.type === 'string') {
    return 'z.string()';
  } else if (schema.type === 'number' || schema.type === 'integer') {
    return 'z.number()';
  } else if (schema.type === 'boolean') {
    return 'z.boolean()';
  } else {
    return 'z.unknown()';
  }
}
