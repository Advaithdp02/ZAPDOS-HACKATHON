'use server';

/**
 * @fileOverview A flow for generating email templates using AI.
 *
 * - generateEmailTemplate - A function that generates an email template.
 * - GenerateEmailTemplateInput - The input type for the generateEmailTemplate function.
 * - GenerateEmailTemplateOutput - The return type for the generateEmailTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailTemplateInputSchema = z.object({
  stage: z
    .string()
    .describe(
      'The stage of the placement process for which the email template is needed (e.g., application received, interview scheduled, offer released, rejection email).'
    ),
  companyName: z.string().describe('The name of the company.'),
  role: z.string().describe('The role offered by the company.'),
  studentName: z.string().describe('The name of the student.'),
  additionalDetails: z.string().optional().describe('Any additional details to include in the email.'),
});
export type GenerateEmailTemplateInput = z.infer<typeof GenerateEmailTemplateInputSchema>;

const GenerateEmailTemplateOutputSchema = z.object({
  emailTemplate: z.string().describe('The generated email template.'),
});
export type GenerateEmailTemplateOutput = z.infer<typeof GenerateEmailTemplateOutputSchema>;

export async function generateEmailTemplate(
  input: GenerateEmailTemplateInput
): Promise<GenerateEmailTemplateOutput> {
  return generateEmailTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailTemplatePrompt',
  input: {schema: GenerateEmailTemplateInputSchema},
  output: {schema: GenerateEmailTemplateOutputSchema},
  prompt: `You are an expert email template generator for college placements.

  Based on the stage, company name, role, and student name, generate an email template.
  Include any additional details provided.

  Stage: {{{stage}}}
  Company Name: {{{companyName}}}
  Role: {{{role}}}
  Student Name: {{{studentName}}}
  Additional Details: {{{additionalDetails}}}

  Email Template:`, //Crucially, you MUST NOT attempt to directly call functions or perform any complex logic _within_ the Handlebars template string. Handlebars is designed to be logic-less and is purely for presentation of pre-processed data.
});

const generateEmailTemplateFlow = ai.defineFlow(
  {
    name: 'generateEmailTemplateFlow',
    inputSchema: GenerateEmailTemplateInputSchema,
    outputSchema: GenerateEmailTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
