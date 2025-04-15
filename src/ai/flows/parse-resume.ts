// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview Parses a resume (PDF) to extract text and relevant information.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import Anthropic from '@anthropic-ai/sdk';
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
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set.');
  }

  try {
    const result = await anthropic.messages.create({
      model: 'claude-3-opus-20240229', // Or another suitable model
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert HR professional. Please parse the following resume text and extract the relevant information. Structure the output as a JSON object with the following fields:

            - name (string): The candidate's full name.
            - email (string): The candidate's email address.
            - phone (string): The candidate's phone number.
            - skills (array of strings): A list of the candidate's skills.
            - experience (array of strings): A list of the candidate's work experiences, including company names, job titles, and dates of employment.
            - education (array of strings): A list of the candidate's educational qualifications, including institutions, degrees, and dates of graduation.

            Resume Text:
            ${input.resumeText}

            Provide the output as a valid JSON object.`,
        },
      ],
    });

    const jsonOutput = result.content[0].text;
    if (!jsonOutput) {
      throw new Error('No output received from Anthropic API.');
    }

    return JSON.parse(jsonOutput) as ParseResumeOutput;
  } catch (error) {
    console.error('Error parsing resume with Anthropic API:', error);
    throw new Error(`Failed to parse resume: ${error}`);
  }
}

