import { GlyphForge } from '../index.js';
import glyphForgeConfig from './glyph-forge.config.js';

async function run() {
  const glyphForge = new GlyphForge(glyphForgeConfig);
  await glyphForge.forge();
}

run().catch(console.error);
