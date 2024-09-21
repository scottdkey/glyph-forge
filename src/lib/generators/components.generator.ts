import { OpenAPIV3 } from 'openapi-types';
import { logger } from '../../logger.js';
import { zodSchemaGenerator } from './zodSchema.generator.js';

export function generateComponents(schema: OpenAPIV3.Document): OpenAPIV3.ComponentsObject {
  let output = 'import { z } from "zod";\n\n';
  output += 'export const SchemaRefs: { [key: string]: z.ZodTypeAny } = {};\n\n';

  const components: OpenAPIV3.ComponentsObject = {};

  if (schema.components) {
    if (schema.components.schemas) {
      components.schemas = {};
      for (const [name, schemaObject] of Object.entries(schema.components.schemas)) {
        const zodSchema = zodSchemaGenerator(schemaObject as OpenAPIV3.SchemaObject);
        output += `SchemaRefs['${name}'] = ${zodSchema};\n`;
        components.schemas[name] = schemaObject;
      }
    }

    if (schema.components.parameters) {
      output += '\nexport const ParameterRefs: { [key: string]: z.ZodTypeAny } = {};\n\n';
      components.parameters = {};
      for (const [name, paramObject] of Object.entries(schema.components.parameters)) {
        if ('schema' in paramObject) {
          const zodSchema = zodSchemaGenerator(paramObject.schema as OpenAPIV3.SchemaObject);
          output += `ParameterRefs['${name}'] = ${zodSchema};\n`;
          components.parameters[name] = paramObject;
        }
      }
    }
  }

  // You might want to handle this output string separately
  logger.info(output);

  return components;
}
