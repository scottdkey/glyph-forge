import { Command } from 'commander';
import { GlyphForge } from './index.js';
import path from 'path';
import { logger } from './logger.js';
import { ConfigSchema } from './lib/schemas/Config.schema.js';

const program = new Command();

program
  .name('glyph-forge')
  .description('CLI for glyph-forge library')
  .version('1.0.0')
  .option('-c, --config <path>', 'Path to the configuration file (.js or .ts)')
  .option('-o, --output <path>', 'Override the output path specified in the config')
  .action(async (options) => {
    try {
      if (!options.config) {
        logger.error(
          'Please provide a path to the configuration file using the -c or --config option.',
        );
        process.exit(1);
      }

      // Remove any surrounding quotes and escape characters
      const cleanConfigPath = options.config.replace(/^['"]|['"]$/g, '').replace(/\\+/g, '/');
      const configPath = path.resolve(cleanConfigPath);
      logger.info({ configPath }, 'Attempting to load config from:');

      try {
        // Dynamically import the config file
        const configModule = await import(configPath);
        logger.info('Config module imported successfully');

        let config = configModule.default || configModule;
        logger.info({ config }, 'Loaded config object:');

        // Validate the config
        config = ConfigSchema.parse(config);
        logger.info('Config validated successfully');

        // Override output path if specified in CLI
        if (options.output) {
          config.outputPath = path.resolve(options.output);
        }

        const glyphForge = new GlyphForge(config);
        await glyphForge.forge();
      } catch (importError: unknown) {
        logger.error(
          {
            error: importError,
            message: importError instanceof Error ? importError.message : 'Unknown error',
            stack: importError instanceof Error ? importError.stack : 'No stack trace',
          },
          'Error importing or parsing config file:',
        );
        process.exit(1);
      }
    } catch (error: unknown) {
      logger.error(
        {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
        },
        'An unexpected error occurred:',
      );
      process.exit(1);
    }
  });

program.parse(process.argv);
