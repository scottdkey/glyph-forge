import { OpenAPIV3 } from 'openapi-types';
import { logger } from './logger.js';
import { parseAndWriteOpenApiSchemaToFiles } from './lib/parseAndWriteOpenApiSchemaToFiles.js';
import { Config, ConfigSchema } from './lib/schemas/Config.schema.js';
import { fetchAndValidateOpenApiSchema } from './lib/schemas/fetchAndValidateOpenApi.schema.js';

export class GlyphForge {
  private config: Config;

  constructor(config: Config) {
    this.config = ConfigSchema.parse(config);
  }

  async forge(): Promise<void> {
    logger.info({ sources: this.config.sources }, 'Forging glyphs from sources');

    const schemas: OpenAPIV3.Document[] = [];
    const sources: string[] = [];

    for (const source of this.config.sources) {
      try {
        const schema = await fetchAndValidateOpenApiSchema(source, this.config.options.timeout);
        schemas.push(schema);
        sources.push(source);
        logger.info({ source }, 'Successfully fetched and validated schema');
      } catch (error) {
        logger.error({ source, error }, 'Error processing source');
        // Implement retry logic here if needed
      }
    }

    if (schemas.length > 0) {
      await parseAndWriteOpenApiSchemaToFiles(schemas, this.config.outputPath);
    } else {
      logger.warn('No valid schemas were fetched. No files will be generated.');
    }
  }
}
