// src/ai/flows/evaluate-resume.ts
'use server';
/**
 * @fileOverview Resume evaluation flow.
 *
 * evaluateResume - A function that evaluates the parsed resume content against the defined criteria and generates a score.
 * EvaluateResumeInput - The input type for the evaluateResume function.
 * EvaluateResumeOutput - The return type for the evaluateResume function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const EvaluateResumeInputSchema = z.object({
  resumeText: z.string().describe('The parsed text content of the resume.'),
  criteria: z.string().describe('The criteria to evaluate the resume against, including required skills, experience level, and keywords.'),
});
export type EvaluateResumeInput = z.infer<typeof EvaluateResumeInputSchema>;

const EvaluateResumeOutputSchema = z.object({
  score: z.number().describe('A score indicating the candidate\'s suitability based on the criteria.'),
  strengths: z.string().describe('Key strengths of the candidate based on the resume content.'),
  weaknesses: z.string().describe('Areas where the candidate can improve based on the resume content.'),
  justification: z.string().describe('A detailed justification of the score, highlighting how the resume matches or doesn\'t match the criteria.'),
});
export type EvaluateResumeOutput = z.infer<typeof EvaluateResumeOutputSchema>;

export async function evaluateResume(input: EvaluateResumeInput): Promise<EvaluateResumeOutput> {
  return evaluateResumeFlow(input);
}

const evaluateResumePrompt = ai.definePrompt({
  name: 'evaluateResumePrompt',
  input: {
    schema: z.object({
      resumeText: z.string().describe('The parsed text content of the resume.'),
      criteria: z.string().describe('The criteria to evaluate the resume against, including required skills, experience level, and keywords.'),
    }),
  },
  output: {
    schema: z.object({
      score: z.number().describe('A score indicating the candidate\'s suitability based on the criteria.'),
      strengths: z.string().describe('Key strengths of the candidate based on the resume content.'),
      weaknesses: z.string().describe('Areas where the candidate can improve based on the resume content.'),
      justification: z.string().describe('A detailed justification of the score, highlighting how the resume matches or doesn\'t match the criteria.'),
    }),
  },
  prompt: `You are an AI resume evaluator. Evaluate the following resume against the provided criteria and generate a score, highlighting strengths and weaknesses, and providing a detailed justification for the score.\n\nResume:\n{{{resumeText}}}\n\nCriteria:\n{{{criteria}}}\n\nProvide the response in JSON format. Include a numeric score, strengths, weaknesses, and a justification for the score. The score should be a number between 0 and 100, with higher scores indicating a better fit. Strengths and Weaknesses should be a short bulleted list.
`,
});

const evaluateResumeFlow = ai.defineFlow<
  typeof EvaluateResumeInputSchema,
  typeof EvaluateResumeOutputSchema
>({
  name: 'evaluateResumeFlow',
  inputSchema: EvaluateResumeInputSchema,
  outputSchema: EvaluateResumeOutputSchema,
}, async (input) => {
  const {output} = await evaluateResumePrompt(input);
  return output!;
});
