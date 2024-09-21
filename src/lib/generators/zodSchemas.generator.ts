import { OpenAPIV3 } from 'openapi-types';
import { logger } from '../../logger.js';
import { MergedSchemas } from '../mergeSchemas.js';

export function zodSchemasGenerator(schema: MergedSchemas): string {
  let output = 'import { z } from "zod";\n\n';

  if (schema.components && schema.components.schemas) {
    for (const [name, schemaObject] of Object.entries(schema.components.schemas)) {
      try {
        output += `export const ${name}Schema = ${generateZodSchema(schemaObject as OpenAPIV3.SchemaObject)};\n\n`;
      } catch (error) {
        logger.error(`Error generating Zod schema for ${name}: ${error}`);
      }
    }
  }

  return output;
}

function generateZodSchema(schema: OpenAPIV3.SchemaObject): string {
  switch (schema.type) {
    case 'string':
      return 'z.string()';
    case 'number':
    case 'integer':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'array':
      return `z.array(${generateZodSchema(schema.items as OpenAPIV3.SchemaObject)})`;
    case 'object':
      if (schema.properties) {
        let objectSchema = 'z.object({\n';
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          const isRequired = schema.required?.includes(propName);
          objectSchema += `  ${propName}: ${generateZodSchema(propSchema as OpenAPIV3.SchemaObject)}${isRequired ? '' : '.optional()'},\n`;
        }
        objectSchema += '})';
        return objectSchema;
      }
      return 'z.record(z.unknown())';
    default:
      return 'z.unknown()';
  }
}
