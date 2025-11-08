
'use server';
/**
 * @fileOverview An AI-powered tool to calculate a student's hirability score for a specific job drive.
 *
 * - getHirability - A function that calculates the hirability score.
 * - GetHirabilityInput - The input type for the getHirability function.
 * - GetHirabilityOutput - The return type for the getHirability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Drive, StudentProfile } from '@/lib/types';

// Use zod to define the schemas for the complex types
const EducationItemSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  grade: z.string(),
  verified: z.boolean().optional(),
});

const ExperienceItemSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  skillsUsed: z.array(z.string()).optional(),
  verified: z.boolean().optional(),
});

const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuingOrganization: z.string(),
  issueDate: z.string(),
  credentialId: z.string().optional(),
  verified: z.boolean().optional(),
});


const StudentProfileSchema = z.object({
  studentId: z.string(),
  name: z.string(),
  email: z.string(),
  department: z.string(),
  cgpa: z.number(),
  resumeUrl: z.string(),
  skills: z.array(z.string()),
  education: z.array(EducationItemSchema),
  experience: z.array(ExperienceItemSchema),
  certifications: z.array(CertificationItemSchema),
  registrationStatus: z.enum(["Pending", "Approved", "Rejected"]).optional(),
});

const DriveSchema = z.object({
    id: z.string(),
    companyId: z.string(),
    title: z.string(),
    description: z.string(),
    roles: z.array(z.string()),
    skills: z.array(z.string()),
    location: z.string(),
    employmentType: z.enum(["Full-time", "Internship", "Part-time"]),
    minCgpa: z.number().optional(),
    allowedBacklogs: z.number().optional(),
    eligibleBranches: z.array(z.string()),
    ctc: z.string(),
    status: z.enum(["active", "ongoing", "completed", "upcoming"]),
    applicationDeadline: z.string().optional(),
    driveDate: z.string().optional(),
    applications: z.array(z.string()),
    stages: z.array(z.string()),
});


const GetHirabilityInputSchema = z.object({
  drive: DriveSchema.describe('The job drive object.'),
  student: StudentProfileSchema.describe('The student profile object.'),
});
export type GetHirabilityInput = z.infer<typeof GetHirabilityInputSchema>;

const GetHirabilityOutputSchema = z.object({
  hirability: z.number().int().min(0).max(100).describe('A score from 0 to 100 representing how hirable the student is for this specific role.'),
  reasoning: z.string().describe('A brief explanation for the calculated score, highlighting strengths and areas for improvement.'),
});
export type GetHirabilityOutput = z.infer<typeof GetHirabilityOutputSchema>;

export async function getHirability(input: {drive: Drive, student: StudentProfile}): Promise<GetHirabilityOutput> {
  return getHirabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHirabilityPrompt',
  input: {schema: GetHirabilityInputSchema},
  output: {schema: GetHirabilityOutputSchema},
  prompt: `You are an expert technical recruiter. Analyze the student's profile against the job description and provide a hirability score from 0 to 100.

Job Description:
- Title: {{{drive.title}}}
- Company Description: {{{drive.description}}}
- Required Skills: {{#each drive.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Minimum CGPA: {{#if drive.minCgpa}}{{{drive.minCgpa}}}{{else}}Not specified{{/if}}
- Eligible Branches: {{#each drive.eligibleBranches}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Student's Profile:
- Name: {{{student.name}}}
- Department: {{{student.department}}}
- CGPA: {{{student.cgpa}}}
- Skills: {{#each student.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Education:
{{#each student.education}}
  - {{{degree}}} at {{{institution}}} ({{{startDate}}}-{{{endDate}}}), Grade: {{{grade}}}
{{/each}}
- Experience:
{{#each student.experience}}
  - {{{role}}} at {{{company}}} ({{{startDate}}}-{{{endDate}}}). Description: {{{description}}}. Skills Used: {{#each skillsUsed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Based on this, provide a hirability score and a brief reasoning. The score should reflect the match between the student's qualifications (skills, experience, CGPA, department) and the job requirements. A higher score means a better fit. Consider if the student's branch is eligible and if their CGPA meets the minimum.
`,
});

const getHirabilityFlow = ai.defineFlow(
  {
    name: 'getHirabilityFlow',
    inputSchema: GetHirabilityInputSchema,
    outputSchema: GetHirabilityOutputSchema,
  },
  async ({ drive, student }) => {
    const {output} = await prompt({drive, student});
    return output!;
  }
);
