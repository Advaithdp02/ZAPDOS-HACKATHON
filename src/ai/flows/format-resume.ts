
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
  formattedResume: z.string().describe('The complete resume, formatted in a single block of HTML using Tailwind CSS classes for styling. Do not include <!DOCTYPE>, <html>, <head>, or <body> tags.'),
});
export type FormatResumeOutput = z.infer<typeof FormatResumeOutputSchema>;

export async function formatResume(input: FormatResumeInput): Promise<FormatResumeOutput> {
  return formatResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatResumePrompt',
  input: {schema: FormatResumeInputSchema},
  output: {schema: FormatResumeOutputSchema},
  prompt: `You are an expert resume builder. Your task is to format the given information into a professional resume using a single block of HTML with Tailwind CSS classes, based on the selected style. The output will be rendered in an A4-sized frame, so you MUST design your layout to fit this space effectively. Adjust the tone and content to match the style.

Resume Style: {{{resumeStyle}}}

**Style Guidelines & Formatting (Use these classes):**

- **ATS Style (Simple, single-column, machine-readable):**
  - Main Container: \`<div class="p-8 font-sans text-base text-gray-800 bg-white h-full">\`
  - Header: Center-align name and contact info. Name: \`<h1 class="text-3xl font-bold text-center text-gray-900">\`. Contact: \`<p class="text-center text-gray-600">\`.
  - Section Title: \`<h2 class="text-xl font-bold border-b-2 border-gray-300 pb-1 mt-6 mb-3 text-gray-800">\`
  - Entry Container: \`<div class="mb-4">\`
  - Entry Header: \`<h3 class="font-semibold text-lg">\`. Company/Institution: \`<p class="text-gray-600">\`. Dates: \`<p class="text-sm text-gray-500">\`.
  - Skills: Comma-separated list under a 'Skills' section.

- **Minimalist Style (Elegant, whitespace, typography-focused):**
  - Main Container: \`<div class="p-10 font-serif bg-white h-full">\`
  - Header: \`<div class="text-center mb-10">\`. Name: \`<h1 class="text-4xl tracking-widest font-light uppercase">\`. Contact: \`<p class="text-sm tracking-wider text-gray-500">\`.
  - Section Title: \`<h2 class="text-lg font-medium tracking-widest uppercase text-gray-600 border-b border-gray-200 pb-2 mb-6">\`
  - Entry Container: \`<div class="mb-6 flex justify-between">\`
  - Entry Details (Left): \`<div><h3 class="font-semibold text-lg">Role/Degree</h3><p class="text-gray-600">Company/Institution</p></div>\`
  - Entry Meta (Right): \`<div class="text-right text-sm text-gray-500">Dates<br/>Grade</div>\`
  - Skills: Display as subtle badges: \`<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">\`.

- **Graphical Style (Colorful, designer-focused, uses emojis and creative layouts):**
  - Main Container: \`<div class="font-sans bg-gray-50 h-full flex">\`
  - **Left Column (Sidebar):** \`<div class="w-1/3 bg-gray-800 text-white p-8 flex flex-col">\`
    - Profile Section: \`<div><h1 class="text-3xl font-bold text-accent">Name</h1><p class="text-lg">A short, punchy title</p></div>\`
    - Contact Info: \`<div class="mt-8 space-y-3"><div><span class="mr-2">📧</span><span>Email</span></div>...\`
    - Skills Section: \`<h2 class="text-accent font-bold mt-8 mb-4">🎨 SKILLS</h2>\` For each skill: \`<div class="mb-2"><p class="text-sm">Skill Name</p><div class="bg-gray-700 h-1.5 rounded-full"><div class="bg-accent h-1.5 rounded-full" style="width: 85%;"></div></div></div>\`
  - **Right Column (Main Content):** \`<div class="w-2/3 p-8 text-gray-700">\`
    - Experience Section Title: \`<h2 class="text-2xl font-bold text-gray-800 flex items-center mb-6"><span class="text-3xl mr-3">🚀</span>EXPERIENCE</h2>\`
    - Experience Entry: \`<div class="mb-6 relative pl-6 before:absolute before:left-1 before:top-1.5 before:h-full before:w-0.5 before:bg-gray-300"><div class="absolute -left-1 top-2.5 h-4 w-4 rounded-full bg-accent border-4 border-white"></div><p class="text-xs text-accent font-bold">START - END</p><h3 class="text-lg font-semibold">Role</h3><p class="text-gray-600 mb-2">Company</p><p class="text-sm">Description...</p></div>\`
    - Education Section Title: \`<h2 class="text-2xl font-bold text-gray-800 flex items-center mt-10 mb-6"><span class="text-3xl mr-3">🎓</span>EDUCATION</h2>\`
    - Education Entry: Similar structure to Experience Entry.

**Output Structure:**
- The output MUST be a single, complete HTML document fragment.
- Do NOT include \`<!DOCTYPE>\`, \`<html>\`, \`<head>\`, or \`<body>\` tags.
- Use Tailwind CSS classes for ALL styling.

Here is the information:
- Name: {{{name}}}
- Email: {{{email}}}
{{#if phone}}
- Phone: {{{phone}}}
{{/if}}
- Education: {{{education}}}
- Skills: {{{skills}}}
- Experience: {{{experience}}}

Now, create the formatted resume as an HTML document fragment in the '{{{resumeStyle}}}' style, adhering to the specified tone and formatting guidelines.
`});

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
