'use server';

/**
 * @fileOverview A flow for generating email templates for students using AI.
 *
 * - generateStudentEmailTemplate - A function that generates an email template for a student.
 * - GenerateStudentEmailTemplateInput - The input type for the generateStudentEmailTemplate function.
 * - GenerateStudentEmailTemplateOutput - The return type for the generateStudentEmailTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudentEmailTemplateInputSchema = z.object({
  purpose: z
    .string()
    .describe(
      'The purpose of the email (e.g., Post-Interview Thank You, Application Follow-up, Accepting a Job Offer).'
    ),
  companyName: z.string().describe('The name of the company.'),
  role: z.string().describe('The role applied for.'),
  studentName: z.string().describe('The name of the student.'),
  interviewerName: z.string().optional().describe('The name of the interviewer, if applicable.'),
  additionalDetails: z.string().optional().describe('Any additional details to include in the email.'),
});
export type GenerateStudentEmailTemplateInput = z.infer<typeof GenerateStudentEmailTemplateInputSchema>;

const GenerateStudentEmailTemplateOutputSchema = z.object({
  emailTemplate: z.string().describe('The generated email template, including subject and body.'),
});
export type GenerateStudentEmailTemplateOutput = z.infer<typeof GenerateStudentEmailTemplateOutputSchema>;

export async function generateStudentEmailTemplate(
  input: GenerateStudentEmailTemplateInput
): Promise<GenerateStudentEmailTemplateOutput> {
  return generateStudentEmailTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentEmailTemplatePrompt',
  input: {schema: GenerateStudentEmailTemplateInputSchema},
  output: {schema: GenerateStudentEmailTemplateOutputSchema},
  prompt: `You are an expert career coach who helps students write professional emails.

  Based on the provided details, generate a complete email template including a professional subject line and body.

  Purpose: {{{purpose}}}
  Company Name: {{{companyName}}}
  Role: {{{role}}}
  Student Name: {{{studentName}}}
  {{#if interviewerName}}
  Interviewer's Name: {{{interviewerName}}}
  {{/if}}
  {{#if additionalDetails}}
  Additional Details to Include: {{{additionalDetails}}}
  {{/if}}

  Generate the email now.
  `,
});

const generateStudentEmailTemplateFlow = ai.defineFlow(
  {
    name: 'generateStudentEmailTemplateFlow',
    inputSchema: GenerateStudentEmailTemplateInputSchema,
    outputSchema: GenerateStudentEmailTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
