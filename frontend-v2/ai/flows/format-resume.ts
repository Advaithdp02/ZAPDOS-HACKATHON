
'use server';
/**
 * @fileOverview An AI-powered resume formatting tool for students.
 *
 * - formatResume - A function that takes student's information and formats it into a professional resume template.
 * - FormatResumeInput - The input type for the formatResume function.
 * - FormatResumeOutput - The return type for the formatResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatResumeInputSchema = z.object({
  name: z.string().describe("The student's full name."),
  email: z.string().describe("The student's email address."),
  phone: z.string().optional().describe("The student's phone number."),
  education: z.string().describe("Details about the student's education."),
  skills: z.string().describe("A list of the student's skills."),
  experience: z.string().describe("Details about the student's work experience and projects, including skills used."),
  resumeStyle: z.enum(['ATS', 'Minimalist', 'Graphical']).describe("The desired style of the resume: 'ATS', 'Minimalist', or 'Graphical'."),
});
export type FormatResumeInput = z.infer<typeof FormatResumeInputSchema>;

const FormatResumeOutputSchema = z.object({
  formattedResume: z.string().describe('The complete resume, formatted in a clean, professional, single-column Markdown format. Use headings for each section (e.g., ## Education, ## Skills, ## Experience).'),
});
export type FormatResumeOutput = z.infer<typeof FormatResumeOutputSchema>;

export async function formatResume(input: FormatResumeInput): Promise<FormatResumeOutput> {
  return formatResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatResumePrompt',
  input: {schema: FormatResumeInputSchema},
  output: {schema: FormatResumeOutputSchema},
  prompt: `You are an expert resume builder. Your task is to format the given information into a professional resume using Markdown, based on the selected style.

Resume Style: {{{resumeStyle}}}

**Style Guidelines:**
- **ATS:** Single-column, standard fonts, no complex formatting, focus on keywords and clear sections. Prioritize clarity and parsability.
- **Minimalist:** Clean, lots of white space, simple and elegant layout, single-column, focus on typography.
- **Graphical:** Can use two columns, icons for contact info, and visual elements like progress bars for skills (represented in Markdown). More visually creative.

The output must be well-structured. Use Markdown headings for sections like "Education", "Skills", and "Experience". For experience, make sure to highlight the skills used.

Here is the information:
- Name: {{{name}}}
- Email: {{{email}}}
{{#if phone}}
- Phone: {{{phone}}}
{{/if}}

- Education:
{{{education}}}

- Skills:
{{{skills}}}

- Experience:
{{{experience}}}

Now, create the formatted resume in the '{{{resumeStyle}}}' style.
`,
});

const formatResumeFlow = ai.defineFlow(
  {
    name: 'formatResumeFlow',
    inputSchema: FormatResumeInputSchema,
    outputSchema: FormatResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
