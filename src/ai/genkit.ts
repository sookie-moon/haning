
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config as dotenvConfig } from 'dotenv';

// Load .env file only if not in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Genkit: Attempting to load .env file for local development...');
  dotenvConfig({ path: '.env' });
  const localApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  console.log('Genkit (Local Dev): API Key status from .env:', localApiKey ? 'Loaded' : 'Not Loaded or Empty');
} else {
  console.log('Genkit (Production): Checking for API Key from Vercel environment variables...');
  const prodApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!prodApiKey) {
    console.error('CRITICAL GENKIT CONFIG ERROR (Production): API Key (GEMINI_API_KEY or GOOGLE_API_KEY) is NOT SET. AI features WILL FAIL.');
  } else {
    console.log('Genkit (Production): API Key status: Available');
  }
}

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const plugins = [];

if (apiKey) {
  plugins.push(googleAI({ apiKey }));
  console.log('Genkit: Initializing GoogleAI plugin WITH an explicit API key.');
} else {
  // Attempt to initialize googleAI without an explicit key.
  // It will try to use GOOGLE_API_KEY or GEMINI_API_KEY from the environment.
  // If neither is set, calls to the model will fail.
  plugins.push(googleAI());
  console.warn('Genkit: Initializing GoogleAI plugin WITHOUT an explicit API key. Will rely on environment variables (GEMINI_API_KEY or GOOGLE_API_KEY).');
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL GENKIT POST-INIT (Production): GoogleAI plugin initialized without an explicit API key because it was not found. AI calls WILL FAIL if not set in environment.');
  } else {
    console.warn('Genkit POST-INIT (Local Dev): GoogleAI plugin initialized without an explicit API key. Ensure GEMINI_API_KEY or GOOGLE_API_KEY is in your .env file or environment.');
  }
}

export const ai = genkit({
  plugins: plugins,
});

// Final check log
if (!apiKey && process.env.NODE_ENV === 'production') {
  // This log might be redundant given the one inside the `else` block above, but reinforces the point.
  console.error('Genkit Final Check (Production): API Key was NOT available. AI features will not work.');
} else if (!apiKey) {
  console.warn('Genkit Final Check (Local Dev): API Key was NOT available. AI features might not work if not set in environment.');
} else {
  console.log('Genkit Final Check: API Key was available for initialization.');
}
