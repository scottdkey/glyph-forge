// src/cli.ts

import { Command } from 'commander';
import { createGlyphForge } from './index.js';
import path from 'path';
import { logger } from './logger.js';
import { Config, ConfigSchema } from './lib/schemas/Config.schema.js';

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
      logger.info(options, 'Original config:');
      logger.info(configPath, 'Config path:');

      // Dynamically import the config file
      const configModule = await import(configPath);
      let config: Config = configModule.default || configModule;

      // Validate the config
      config = ConfigSchema.parse(config);

      // Override output path if specified in CLI
      if (options.output) {
        config.outputPath = path.resolve(options.output);
      }

      const glyphForge = createGlyphForge(config);
      await glyphForge.forge();
    } catch (error) {
      logger.error('An error occurred:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
