'use server';
/**
 * @fileOverview A flow to translate text to a specified language.
 *
 * - translatePoem - A function that handles the text translation.
 * - TranslatePoemInput - The input type for the translatePoem function.
 * - TranslatePoemOutput - The return type for the translatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePoemInputSchema = z.object({
  poemText: z.string().describe('The poem text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Spanish", "French", "German").'),
});
export type TranslatePoemInput = z.infer<typeof TranslatePoemInputSchema>;

const TranslatePoemOutputSchema = z.object({
  translatedPoem: z.string().describe('The translated poem text.'),
});
export type TranslatePoemOutput = z.infer<typeof TranslatePoemOutputSchema>;

export async function translatePoem(input: TranslatePoemInput): Promise<TranslatePoemOutput> {
  return translatePoemFlow(input);
}

const translatePoemPrompt = ai.definePrompt({
  name: 'translatePoemPrompt',
  input: {schema: TranslatePoemInputSchema},
  output: {schema: TranslatePoemOutputSchema},
  prompt: `Translate the following poem into {{targetLanguage}}:\n\n{{poemText}}\n\nReturn only the translated text. Ensure the translation captures the poetic essence and style of the original text where possible.`,
});

const translatePoemFlow = ai.defineFlow(
  {
    name: 'translatePoemFlow',
    inputSchema: TranslatePoemInputSchema,
    outputSchema: TranslatePoemOutputSchema,
  },
  async (input) => {
    const {output} = await translatePoemPrompt(input);
    return output!;
  }
);
