import { OpenAPIV3 } from 'openapi-types';
import { MergedSchemas } from '../mergeSchemas.js';
import { logger } from '../../logger.js';
import { functionGenerator } from './function.generator.js';

export function apiFunctionGenerator(schema: MergedSchemas): string {
  let output = `import { z } from "zod";\n`;
  output += `import { SchemaRefs } from "./types";\n\n`;

  output += `export class ApiClient {\n`;
  output += `  private baseUrls: Record<string, string>;\n`;
  output += `  private headers: Record<string, string>;\n`;
  output += `  private validateResponse: boolean;\n\n`;
  output += `  constructor(baseUrls: Record<string, string>, headers: Record<string, string> = {}, validateResponse: boolean = false) {\n`;
  output += `    this.baseUrls = baseUrls;\n`;
  output += `    this.headers = headers;\n`;
  output += `    this.validateResponse = validateResponse;\n`;
  output += `  }\n\n`;
  output += `  setAuthToken(token: string) {\n`;
  output += `    this.headers['Authorization'] = \`Bearer \${token}\`;\n`;
  output += `  }\n\n`;
  output += `  setBaseUrl(key: string, url: string) {\n`;
  output += `    this.baseUrls[key] = url;\n`;
  output += `  }\n\n`;

  for (const [path, pathItem] of Object.entries(schema.paths ?? {})) {
    if (pathItem) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && operation !== null && 'operationId' in operation) {
          try {
            output += functionGenerator(
              path,
              method as OpenAPIV3.HttpMethods,
              operation as OpenAPIV3.OperationObject,
              schema.components,
            );
            output += '\n\n';
          } catch (error) {
            logger.error(
              { path, method, error },
              `Error generating function for ${path} ${method}: ${error}`,
            );
          }
        }
      }
    }
  }

  output += `}\n`;
  return output;
}
