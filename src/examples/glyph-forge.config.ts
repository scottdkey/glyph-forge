import path from 'path';
import { z } from 'zod';
import { ConfigSchema } from '../lib/schemas/Config.schema.js';

const projectRoot = path.resolve(__dirname, '..');

const Config: z.infer<typeof ConfigSchema> = {
  sources: ['https://api.yuber.app/docs.json', 'https://accounts.yuber.app/docs.json'],
  outputPath: path.join(projectRoot, 'output'),
  options: {
    timeout: process.env['GLYPH_FORGE_TIMEOUT']
      ? parseInt(process.env['GLYPH_FORGE_TIMEOUT'])
      : 10000,
    retries: 5,
    concurrent: 3,
  },
};

export default Config;
