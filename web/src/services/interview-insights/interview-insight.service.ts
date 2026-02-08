import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

import {
  buildPrompt,
  InterviewInsightsResponseSchema,
  schemaDescription,
} from '@/services/interview-insights/helpers';
import { IInterview, InterviewInsights } from '@/types/entities';

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
