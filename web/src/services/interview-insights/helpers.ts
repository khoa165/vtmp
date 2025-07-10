import z from 'zod';

import { IInterview } from '@/models/interview.model';

export const buildPrompt = ({
  companyName,
  sharedInterviews,
}: {
  companyName: string;
  sharedInterviews: IInterview[];
}): string => {
  return `
    ${sharedInterviews}
    \n\n
    You are given a list of interviews of the company ${companyName} that have been shared by users. 
    Each interview contains information about the name of the company, job title, location, interview date, users' note, and other details.
    
    **General Instructions:**
    - Search the internet to provide the company details of the given interviews, and any products that might be helpful to the users.
    - Use the provided interviews to generate insights about the company and interview process.
    - In case none of the interviews provide sufficient information, you may only need to search the internet to include general knowledge about the company and its interview practices.
  `;
};

export const schemaDescription = `
  - companyDetails: A brief description of the company, its mission, and values.
  - companyProducts: A list of key products or services offered by the company.
  - interviewInsights: An object containing:
    - commonQuestions: A list of common interview questions asked in the interviews.
    - interviewProcess: A description of the interview process, including stages and what to expect.
    - tips: General tips for candidates preparing for interviews with this company.
`;

export const InterviewInsightsResponseSchema = z.object({
  companyDetails: z.string(),
  companyProducts: z.string(),
  interviewInsights: z.object({
    commonQuestions: z.array(z.string()),
    interviewProcess: z.string(),
    tips: z.string(),
  }),
});
