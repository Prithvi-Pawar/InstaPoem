// The `use server` directive is required for Server Actions used in Next.js.
'use server';

/**
 * @fileOverview Poem Generation flow from a photo.
 *
 * - generatePoemFromPhoto - A function that handles the poem generation from photo.
 * - GeneratePoemFromPhotoInput - The input type for the generatePoemFromPhoto function.
 * - GeneratePoemFromPhotoOutput - The return type for the generatePoemFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate a poem from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePoemFromPhotoInput = z.infer<typeof GeneratePoemFromPhotoInputSchema>;

const GeneratePoemFromPhotoOutputSchema = z.object({
  poem: z.string().describe('A poem inspired by the image.'),
});
export type GeneratePoemFromPhotoOutput = z.infer<typeof GeneratePoemFromPhotoOutputSchema>;

export async function generatePoemFromPhoto(input: GeneratePoemFromPhotoInput): Promise<GeneratePoemFromPhotoOutput> {
  return generatePoemFromPhotoFlow(input);
}

const generatePoemFromPhotoPrompt = ai.definePrompt({
  name: 'generatePoemFromPhotoPrompt',
  input: {schema: GeneratePoemFromPhotoInputSchema},
  output: {schema: GeneratePoemFromPhotoOutputSchema},
  prompt: `Write a poem inspired by the image. Consider the colors, objects, and overall mood of the image when writing the poem.\n\nImage: {{media url=photoDataUri}}`,
});

const generatePoemFromPhotoFlow = ai.defineFlow(
  {
    name: 'generatePoemFromPhotoFlow',
    inputSchema: GeneratePoemFromPhotoInputSchema,
    outputSchema: GeneratePoemFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await generatePoemFromPhotoPrompt(input);
    return output!;
  }
);
