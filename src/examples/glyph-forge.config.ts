import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');

export default {
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
