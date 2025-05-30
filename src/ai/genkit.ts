
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config as dotenvConfig } from 'dotenv';

// Load .env file only if not in production, as Next.js handles it in prod
// and deployment environments should use platform-provided environment variables.
if (process.env.NODE_ENV !== 'production') {
  dotenvConfig();
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
