import { config } from 'dotenv';
config();

import '@/ai/flows/filter-resumes-with-ai.ts';
import '@/ai/flows/generate-email-templates.ts';
import '@/ai/flows/summarize-drive.ts';
import '@/ai/flows/get-hirability-score.ts';
import '@/ai/flows/generate-student-email-templates.ts';
import '@/ai/flows/format-resume.ts';
