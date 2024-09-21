import { OpenAPIV3 } from 'openapi-types';
import { logger } from '../../logger.js';
import { MergedSchemas } from '../mergeSchemas.js';
import { zodSchemaGenerator } from './zodSchema.generator.js';

export function typescriptInterfacesGenerator(schema: MergedSchemas): string {
  let output = 'import { z } from "zod";\n\n';
  output += `export const SchemaRefs: { [key: string]: z.ZodTypeAny } = {};\n\n`;
  const enums: Record<string, string[]> = {};

  if (schema.components && schema.components.schemas) {
    // First pass: extract enums
    for (const [name, schemaObject] of Object.entries(schema.components.schemas)) {
      if ('type' in schemaObject && schemaObject.type === 'string' && schemaObject.enum) {
        enums[name] = schemaObject.enum;
      }
    }

    // Generate enum definitions
    for (const [name, values] of Object.entries(enums)) {
      output += `export enum ${name} {\n`;
      values.forEach((value) => {
        output += `  ${value} = "${value}",\n`;
      });
      output += `}\n\n`;
    }

    // Second pass: generate schemas and types
    for (const [name, schemaObject] of Object.entries(schema.components.schemas)) {
      try {
        let zodSchema: string;
        if (name in enums) {
          zodSchema = `z.nativeEnum(${name})`;
        } else {
          zodSchema = zodSchemaGenerator(schemaObject as OpenAPIV3.SchemaObject, name, enums);
        }

        output += `export const ${name}Schema = ${zodSchema};\n`;
        output += `SchemaRefs['${name}'] = ${name}Schema;\n`;
        output += `export type ${name} = z.infer<typeof ${name}Schema>;\n\n`;
      } catch (error) {
        logger.error(
          { name, error: error instanceof Error ? error.message : String(error) },
          'Error generating TypeScript interface',
        );
        logger.error({ schemaObject }, 'Problematic schema object');
      }
    }
  } else {
    logger.error({ schema }, 'No components or schemas found in the merged schema');
  }

  return output;
}
