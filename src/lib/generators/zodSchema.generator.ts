import { OpenAPIV3 } from 'openapi-types';
export function zodSchemaGenerator(
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
  schemaName?: string,
  enums: Record<string, string[]> = {},
): string {
  if ('$ref' in schema) {
    return `z.lazy(() => ${schema.$ref.split('/').pop()}Schema)`;
  }

  let zodSchema = '';

  switch (schema.type) {
    case 'string':
      zodSchema = 'z.string()';
      if (schema.format === 'uuid') zodSchema += '.uuid()';
      if (schema.format === 'date-time') zodSchema += '.datetime()';
      if (schema.format === 'uri') zodSchema += '.url()';
      if (schema.minLength) zodSchema += `.min(${schema.minLength})`;
      if (schema.maxLength) zodSchema += `.max(${schema.maxLength})`;
      if (schema.enum) {
        const enumName = Object.keys(enums).find((key) => enums[key] === schema.enum);
        if (enumName) {
          zodSchema = `z.nativeEnum(${enumName})`;
        } else {
          zodSchema = `z.enum([${schema.enum.map((e) => `"${e}"`).join(', ')}])`;
        }
      }
      break;
    case 'number':
    case 'integer':
      zodSchema = 'z.number()';
      if (schema.minimum) zodSchema += `.min(${schema.minimum})`;
      if (schema.maximum) zodSchema += `.max(${schema.maximum})`;
      break;
    case 'boolean':
      zodSchema = 'z.boolean()';
      break;
    case 'array':
      zodSchema = schema.items
        ? `z.array(${zodSchemaGenerator(schema.items, schemaName, enums)})`
        : 'z.array(z.unknown())';
      break;
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, value]) => {
            const propIsRequired = schema.required?.includes(key);
            const propSchema = zodSchemaGenerator(
              value as OpenAPIV3.SchemaObject,
              `${schemaName}${key.charAt(0).toUpperCase() + key.slice(1)}`,
              enums,
            );
            return `${key}: ${propSchema}${propIsRequired ? '' : '.optional()'}`;
          })
          .join(',\n');
        zodSchema = `z.object({\n${props}\n})`;
      } else {
        zodSchema = 'z.object({})';
      }
      break;
    default:
      zodSchema = 'z.unknown()';
  }

  if (schema.nullable) {
    zodSchema += '.nullable()';
  }

  return zodSchema;
}
