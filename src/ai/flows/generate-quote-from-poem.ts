
'use server';
/**
 * @fileOverview A flow to generate a short, emotional quote from a longer poem.
 *
 * - generateQuoteFromPoem - A function that handles the quote generation.
 * - GenerateQuoteInput - The input type for the generateQuoteFromPoem function.
 * - GenerateQuoteOutput - The return type for the generateQuoteFromPoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const emotionStyles: Record<string, { style: string; length: string; example: string; }> = {
    'Love': { style: 'Soft, poetic, heartfelt', length: '1-2 lines', example: 'In your smile, I found my home.' },
    'Sadness': { style: 'Reflective, slow-paced, emotional', length: '2-3 lines', example: 'Some goodbyes don\'t echo in words, they echo in silence.' },
    'Happiness': { style: 'Light, energetic, uplifting', length: '1-2 lines', example: 'Joy is the sunshine we create within.' },
    'Anger': { style: 'Sharp, bold, direct', length: '1-2 lines', example: 'Even silence screams when justice is denied.' },
    'Fear': { style: 'Tense, reflective, dramatic', length: '2-3 lines', example: 'Fear isn’t the shadow. It’s the silence before the storm.' },
    'Hope': { style: 'Uplifting, forward-looking, gentle', length: '2-3 lines', example: 'Even the darkest skies make room for morning light.' },
    'Peace / Calm': { style: 'Minimal, flowing, meditative', length: '1-2 lines', example: 'Peace isn’t a place. It’s a pause.' },
    'Loneliness': { style: 'Quiet, introspective, tender', length: '2-3 lines', example: 'In a room full of echoes, my voice was the only one missing.' },
    'Motivation': { style: 'Bold, energetic, empowering', length: '1-2 lines', example: 'You weren’t made to break — you were made to rise.' },
};


const GenerateQuoteInputSchema = z.object({
  poemText: z.string().describe('The full text of the poem to be condensed into a quote.'),
  emotion: z.string().describe(`The target emotion for the quote. Supported values: ${Object.keys(emotionStyles).join(', ')}`),
});
export type GenerateQuoteInput = z.infer<typeof GenerateQuoteInputSchema>;


const GenerateQuoteOutputSchema = z.object({
  quote: z.string().describe('The generated short quote.'),
});
export type GenerateQuoteOutput = z.infer<typeof GenerateQuoteOutputSchema>;


export async function generateQuoteFromPoem(input: GenerateQuoteInput): Promise<GenerateQuoteOutput> {
  return generateQuoteFromPoemFlow(input);
}


const generateQuoteFromPoemPrompt = ai.definePrompt({
  name: 'generateQuoteFromPoemPrompt',
  input: { schema: z.object({
    poemText: z.string(),
    emotion: z.string(),
    styleDescription: z.string(),
    lengthDescription: z.string(),
    example: z.string()
  })},
  output: {schema: GenerateQuoteOutputSchema},
  prompt: `You are an AI that transforms poems into short, impactful quotes.
The user has provided a poem and wants a quote that reflects the emotion of '{{emotion}}'.

Poem to transform:
"""
{{poemText}}
"""

Based on the poem, generate a new, unique quote that captures its essence while adhering to the following constraints:
- Emotion: {{emotion}}
- Style: {{styleDescription}}
- Length: {{lengthDescription}}

For inspiration on the expected style, consider this example (but do not copy or reuse it): "{{example}}"

Important: Return ONLY the generated quote text, and nothing else.
`,
});

const generateQuoteFromPoemFlow = ai.defineFlow(
  {
    name: 'generateQuoteFromPoemFlow',
    inputSchema: GenerateQuoteInputSchema,
    outputSchema: GenerateQuoteOutputSchema,
  },
  async ({ poemText, emotion }) => {
    const emotionStyle = emotionStyles[emotion] || emotionStyles['Hope']; // Default to 'Hope' if emotion is not found

    const {output} = await generateQuoteFromPoemPrompt({
      poemText,
      emotion,
      styleDescription: emotionStyle.style,
      lengthDescription: emotionStyle.length,
      example: emotionStyle.example,
    });
    return output!;
  }
);
