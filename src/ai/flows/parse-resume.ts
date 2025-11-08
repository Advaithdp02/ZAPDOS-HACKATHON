'use server';
/**
 * @fileOverview An AI-powered resume parsing tool to extract structured data.
 *
 * - parseResume - A function that extracts skills, education, experience, and certifications from a resume.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;


const EducationItemSchema = z.object({
  degree: z.string().describe("The degree or qualification obtained."),
  institution: z.string().describe("The name of the university or institution."),
  startDate: z.string().describe("The start date of the education (e.g., 'YYYY' or 'Month YYYY')."),
  endDate: z.string().describe("The end date or expected graduation date (e.g., 'YYYY' or 'Month YYYY')."),
  grade: z.string().describe("The grade, CGPA, or any relevant score."),
});

const ExperienceItemSchema = z.object({
  role: z.string().describe("The job title or role."),
  company: z.string().describe("The name of the company or organization."),
  startDate: z.string().describe("The start date of the employment (e.g., 'Month YYYY')."),
  endDate: z.string().describe("The end date of the employment (e.g., 'Month YYYY' or 'Present')."),
  description: z.string().describe("A brief description of the responsibilities and achievements."),
  skillsUsed: z.array(z.string()).optional().describe("A list of key skills used in this role."),
});

const CertificationItemSchema = z.object({
  name: z.string().describe("The name of the certification or course."),
  issuingOrganization: z.string().describe("The organization that issued the certification."),
  issueDate: z.string().describe("The date the certification was issued (e.g., 'Month YYYY')."),
  credentialId: z.string().optional().describe("The credential ID or number, if available."),
});

const ParseResumeOutputSchema = z.object({
    skills: z.array(z.string()).describe("A list of the candidate's skills."),
    education: z.array(EducationItemSchema).describe("A list of the candidate's educational qualifications."),
    experience: z.array(ExperienceItemSchema).describe("A list of the candidate's work experiences or projects."),
    certifications: z.array(CertificationItemSchema).describe("A list of the candidate's certifications."),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Extract the user's skills, education, work experience, and certifications from the provided resume.

Resume:
{{media url=resumeDataUri}}

Instructions:
1.  Extract all relevant skills, education history, work experience, and certifications.
2.  For each education entry, extract the degree, institution, dates, and grade/CGPA.
3.  For each experience entry, extract the role, company, dates, a description of responsibilities, and skills used.
4.  For each certification, extract the name, issuing organization, and issue date.
5.  Return the data in a structured JSON format. If a field is not present, return an empty array or empty string. Do not invent information.
`,
});

const parseResumeFlow = ai.defineFlow(
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
