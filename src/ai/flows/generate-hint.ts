
// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview A flow to generate cryptic and thematic hints for a Hangman game.
 *
 * - generateHint - A function that generates a hint for a given word and category.
 * - GenerateHintInput - The input type for the generateHint function.
 * - GenerateHintOutput - The return type for the generateHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHintInputSchema = z.object({
  word: z.string().describe('The word the player is trying to guess.'),
  category: z.string().describe('The category of the word (e.g., Movie, Music).'),
  incorrectGuesses: z
    .array(z.string())
    .describe('The list of incorrect letter guesses the player has made.'),
});
export type GenerateHintInput = z.infer<typeof GenerateHintInputSchema>;

const GenerateHintOutputSchema = z.object({
  hint: z.string().describe('A cryptic and thematic hint for the word.'),
});
export type GenerateHintOutput = z.infer<typeof GenerateHintOutputSchema>;

export async function generateHint(input: GenerateHintInput): Promise<GenerateHintOutput> {
  console.log('[generateHint Flow] Received input:', JSON.stringify(input));
  try {
    const result = await generateHintFlow(input);
    console.log('[generateHint Flow] Successfully generated hint:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('[generateHint Flow] Error during execution:', error);
    // Re-throw the error so Next.js handles it and returns a 500,
    // but we've logged details server-side.
    throw error;
  }
}

const generateHintPrompt = ai.definePrompt({
  name: 'generateHintPrompt',
  input: {schema: GenerateHintInputSchema},
  output: {schema: GenerateHintOutputSchema},
  prompt: `You are the AI assistant for a Hangman game.

The player is trying to guess a word in the category "{{category}}". The word is "{{word}}".

The player has made the following incorrect guesses: {{incorrectGuesses}}.

Provide a single cryptic and thematic hint to help the player guess the word, without giving away the answer directly. The hint should be relevant to the category and word.

HINT:`,
});

const generateHintFlow = ai.defineFlow(
  {
    name: 'generateHintFlow',
    inputSchema: GenerateHintInputSchema,
    outputSchema: GenerateHintOutputSchema,
  },
  async input => {
    console.log('[generateHintFlow - inner] Starting flow with input:', JSON.stringify(input));
    try {
      const {output} = await generateHintPrompt(input);
      console.log('[generateHintFlow - inner] Prompt executed, output:', JSON.stringify(output));
      if (!output) {
        console.error('[generateHintFlow - inner] Prompt returned null/undefined output.');
        // This will be caught by the outer try/catch and logged.
        throw new Error('AI prompt returned no output.');
      }
      return output!;
    } catch (error) {
      console.error('[generateHintFlow - inner] Error calling prompt:', error);
      throw error; // Re-throw to be caught by the outer try/catch in the exported generateHint function
    }
  }
);
