'use server';
/**
 * @fileOverview An AI-powered resume filtering tool.
 *
 * - filterResumes - A function that filters resumes based on skills, experience, and education.
 * - FilterResumesInput - The input type for the filterResumes function.
 * - FilterResumesOutput - The return type for the filterResumes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterResumesInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z.string().describe('The description of the job.'),
});
export type FilterResumesInput = z.infer<typeof FilterResumesInputSchema>;

const FilterResumesOutputSchema = z.object({
  candidateInfo: z.object({
    skills: z.string().describe('The skills of the candidate.'),
    experience: z.string().describe('The experience of the candidate.'),
    education: z.string().describe('The education of the candidate.'),
    jobFitAnalysis: z.string().describe('The job fit analysis of the candidate based on the job description.'),
  }).describe('The extracted candidate information and job fit analysis.'),
  formattedResume: z.string().describe('The resume reformatted into a professional template.'),
});
export type FilterResumesOutput = z.infer<typeof FilterResumesOutputSchema>;

export async function filterResumes(input: FilterResumesInput): Promise<FilterResumesOutput> {
  return filterResumesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterResumesPrompt',
  input: {schema: FilterResumesInputSchema},
  output: {schema: FilterResumesOutputSchema},
  prompt: `You are an AI-powered resume filtering tool. You will extract candidate information (skills, experience, and education) from the resume, reformat it into a professional template, and analyze the job fit based on the job description.

Resume:
{{media url=resumeDataUri}}

Job Description: {{{jobDescription}}}

Instructions:
1.  Extract candidate information (skills, experience, and education) from the resume.
2.  Reformat the extracted information into a professional template.
3.  Analyze the job fit based on the job description.
4.  Return the candidate information, job fit analysis, and the reformatted resume.

Output the result in JSON format. Ensure that the 'formattedResume' is well-formatted and easy to read.
`,
});

const filterResumesFlow = ai.defineFlow(
  {
    name: 'filterResumesFlow',
    inputSchema: FilterResumesInputSchema,
    outputSchema: FilterResumesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
