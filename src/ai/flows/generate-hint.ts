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
  return generateHintFlow(input);
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
    const {output} = await generateHintPrompt(input);
    return output!;
  }
);
