
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config as dotenvConfig } from 'dotenv';

// Load .env file only if not in production, as Next.js handles it in prod
// and deployment environments should use platform-provided environment variables.
if (process.env.NODE_ENV !== 'production') {
  console.log('Attempting to load .env file for local development...');
  dotenvConfig({ path: '.env' }); 
  console.log('Local dev: GEMINI_API_KEY from .env:', process.env.GEMINI_API_KEY ? 'Loaded (exists)' : 'Not Loaded or Empty from .env');
} else {
  // This log will appear in Vercel's server-side runtime logs
  console.log('Production: Checking for GEMINI_API_KEY from Vercel environment variables...');
  console.log('Production: GEMINI_API_KEY status:', process.env.GEMINI_API_KEY ? 'Available' : 'NOT AVAILABLE or Empty');
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

// console.log('Genkit initialized with model:', ai.registry.model('googleai/gemini-2.0-flash')?.name || 'Unknown model'); // This line was causing the error

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn('WARNING: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set in the environment. AI calls will likely fail.');
}
