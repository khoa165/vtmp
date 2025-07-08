import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

import { IInterview, InterviewInsights } from '@/models/interview.model';
import {
  buildPrompt,
  InterviewInsightsResponseSchema,
  schemaDescription,
} from '@/services/interview-insights/helpers';

export const InterviewInsightService = {
  getInterviewInsight: async (
    sharedInterviews: IInterview[]
  ): Promise<InterviewInsights> => {
    const prompt = buildPrompt(sharedInterviews);

    const response = await generateObject({
      model: google('gemini-2.0-flash'),
      prompt,
      mode: 'json',
      schemaName: 'InterviewInsights',
      schema: InterviewInsightsResponseSchema,
      schemaDescription,
    });

    return response.object;
  },
};
