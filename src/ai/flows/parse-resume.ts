// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview Parses a resume (PDF) to extract text and relevant information.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume (extracted from PDF).'),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = z.object({
  name: z.string().describe('The name of the candidate.'),
  email: z.string().email().describe('The email address of the candidate.'),
  phone: z.string().describe('The phone number of the candidate.'),
  skills: z.array(z.string()).describe('The list of skills of the candidate.'),
  experience: z.array(z.string()).describe('The list of experiences of the candidate.'),
  education: z.array(z.string()).describe('The list of educations of the candidate.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {
    schema: z.object({
      resumeText: z.string().describe('The text content of the resume (extracted from PDF).'),
    }),
  },
  output: {
    schema: z.object({
      name: z.string().describe('The name of the candidate.'),
      email: z.string().email().describe('The email address of the candidate.'),
      phone: z.string().describe('The phone number of the candidate.'),
      skills: z.array(z.string()).describe('The list of skills of the candidate.'),
      experience: z.array(z.string()).describe('The list of experiences of the candidate.'),
      education: z.array(z.string()).describe('The list of educations of the candidate.'),
    }),
  },
  prompt: `You are an expert resume parser. Extract the following information from the resume text provided.

Resume Text: {{{resumeText}}}

Output the extracted information in JSON format.
`,
});

const parseResumeFlow = ai.defineFlow<
  typeof ParseResumeInputSchema,
  typeof ParseResumeOutputSchema
>(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
