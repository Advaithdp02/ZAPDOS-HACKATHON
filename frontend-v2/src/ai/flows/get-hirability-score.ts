
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

const GetHirabilityInputSchema = z.object({
  drive: z.any().describe('The job drive object.'),
  student: z.any().describe('The student profile object.'),
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
  input: {
      schema: z.object({
          driveDescription: z.string(),
          studentSkills: z.string(),
          studentExperience: z.string(),
          studentEducation: z.string(),
      })
  },
  output: {schema: GetHirabilityOutputSchema},
  prompt: `You are an expert technical recruiter. Analyze the student's profile against the job description and provide a hirability score from 0 to 100.

Job Description:
{{{driveDescription}}}

Student's Skills:
{{{studentSkills}}}

Student's Education:
{{{studentEducation}}}

Student's Experience:
{{{studentExperience}}}

Based on this, provide a hirability score and a brief reasoning. The score should reflect the match between the student's qualifications and the job requirements. A higher score means a better fit.
`,
});

const getHirabilityFlow = ai.defineFlow(
  {
    name: 'getHirabilityFlow',
    inputSchema: GetHirabilityInputSchema,
    outputSchema: GetHirabilityOutputSchema,
  },
  async ({ drive, student }) => {

    const educationString = student.education.map(e => `${e.degree} at ${e.institution} (${e.startDate}-${e.endDate}) with ${e.grade}`).join('; ');
    const experienceString = student.experience.map(e => `${e.role} at ${e.company} (${e.startDate}-${e.endDate}): ${e.description} (Skills: ${e.skillsUsed?.join(', ') || 'N/A'})`).join('; ');

    const {output} = await prompt({
        driveDescription: drive.description,
        studentSkills: student.skills.join(', '),
        studentEducation: educationString,
        studentExperience: experienceString,
    });
    return output!;
  }
);
