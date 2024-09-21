import path from 'path';
import { z } from 'zod';

// Define the shape of our configuration object
export const ConfigSchema = z.object({
  sources: z.array(z.string().url()),
  outputPath: z.string().refine(
    (val) => {
      try {
        path.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: 'Invalid output path',
    },
  ),
  options: z
    .object({
      timeout: z.number().positive().default(5000),
      retries: z.number().nonnegative().default(3),
      concurrent: z.number().positive().default(5),
      // Add more options as needed
    })
    .default({}),
});

export type Config = z.infer<typeof ConfigSchema>;
