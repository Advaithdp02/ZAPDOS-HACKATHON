'use server';
/**
 * @fileOverview A flow for summarizing a job drive description.
 *
 * - summarizeDrive - A function that summarizes a job description.
 * - SummarizeDriveInput - The input type for the summarizeDrive function.
 * - SummarizeDriveOutput - The return type for the summarizeDrive function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDriveInputSchema = z.object({
  jobDescription: z.string().describe('The full job description for the drive.'),
});
export type SummarizeDriveInput = z.infer<typeof SummarizeDriveInputSchema>;

const SummarizeDriveOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key points of the job description, including required skills, experience, and responsibilities. The summary should be a single paragraph.'),
});
export type SummarizeDriveOutput = z.infer<typeof SummarizeDriveOutputSchema>;

export async function summarizeDrive(input: SummarizeDriveInput): Promise<SummarizeDriveOutput> {
  return summarizeDriveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDrivePrompt',
  input: {schema: SummarizeDriveInputSchema},
  output: {schema: SummarizeDriveOutputSchema},
  prompt: `You are an expert career advisor. Summarize the following job description into a single, concise paragraph. Focus on the most important required skills, years of experience, and key responsibilities for a student applicant.

Job Description:
{{{jobDescription}}}

Summary:`,
});

const summarizeDriveFlow = ai.defineFlow(
  {
    name: 'summarizeDriveFlow',
    inputSchema: SummarizeDriveInputSchema,
    outputSchema: SummarizeDriveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
