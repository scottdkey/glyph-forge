import { writeFile, rm, mkdir } from 'fs/promises';
import path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { logger } from '../logger.js';
import { mergeSchemas } from './mergeSchemas.js';
import { typescriptInterfacesGenerator } from './generators/typescriptInterfaces.generator.js';
import { apiFunctionGenerator } from './generators/apiFunction.generator.js';

export async function parseAndWriteOpenApiSchemaToFiles(
  schemas: OpenAPIV3.Document[],
  outputPath: string,
): Promise<void> {
  try {
    await rm(outputPath, { recursive: true, force: true });
    await mkdir(outputPath, { recursive: true });

    const mergedSchema = mergeSchemas(schemas);

    logger.info({}, 'Generating TypeScript interfaces and Zod schemas');
    const tsInterfacesAndZodSchemas = typescriptInterfacesGenerator(mergedSchema);
    await writeFile(path.join(outputPath, 'types.ts'), tsInterfacesAndZodSchemas);
    logger.info({}, 'TypeScript interfaces and Zod schemas generated');

    logger.info({}, 'Generating API client');
    const apiClient = apiFunctionGenerator(mergedSchema);
    await writeFile(path.join(outputPath, 'client.ts'), apiClient);
    logger.info({}, 'API client generated');
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      'Error in parseAndWriteOpenApiSchemaToFiles',
    );
    throw error;
  }
}
