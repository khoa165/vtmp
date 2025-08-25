import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

import { InterviewData, InterviewInsight } from '@vtmp/common/constants';

import { InterviewInsightsResponseSchema } from '@/types/interview-insights.types';
import { buildPrompt, schemaDescription } from '@/utils/prompts';

export const InterviewInsightService = {
  getInterviewInsight: async ({
    sharedInterviews,
  }: {
    sharedInterviews: InterviewData[];
  }): Promise<InterviewInsight[]> => {
    const interviewsGroupedByCompany = Object.groupBy(
      sharedInterviews,
      ({ companyName }) => companyName
    );

    const interviewInsights = await Promise.all(
      Object.entries(interviewsGroupedByCompany).map(
        async ([companyName, sharedInterviews]) => {
          const prompt = buildPrompt({
            companyName,
            sharedInterviews: sharedInterviews ?? [],
          });
          try {
            const response = await generateObject({
              model: google('gemini-2.5-flash'),
              prompt,
              mode: 'json',
              schemaName: 'InterviewInsights',
              schema: InterviewInsightsResponseSchema,
              schemaDescription,
            });

            if (!response.object) {
              throw new Error(
                `Failed to generate insights for company: ${companyName}`
              );
            }

            return {
              companyName,
              ...response.object,
            };
          } catch (error) {
            console.error('Error generating interview insights:', error);
            return null;
          }
        }
      )
    );

    return interviewInsights.filter(
      (insight): insight is InterviewInsight => insight !== null
    );
  },
};
