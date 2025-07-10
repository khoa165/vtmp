import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

import { IInterview, InterviewInsights } from '@/models/interview.model';
import {
  buildPrompt,
  InterviewInsightsResponseSchema,
  schemaDescription,
} from '@/services/interview-insights/helpers';

export const InterviewInsightService = {
  getInterviewInsight: async ({
    companyName,
    sharedInterviews,
  }: {
    companyName: string;
    sharedInterviews: IInterview[];
  }): Promise<InterviewInsights> => {
    const prompt = buildPrompt({ companyName, sharedInterviews });

    const response = await generateObject({
      model: google('gemini-2.5-flash'),
      prompt,
      mode: 'json',
      schemaName: 'InterviewInsights',
      schema: InterviewInsightsResponseSchema,
      schemaDescription,
    });

    return response.object;
  },
};
