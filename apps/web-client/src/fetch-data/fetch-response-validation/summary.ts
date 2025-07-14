import { z } from 'zod';

export const GetSummaryDataResponseSchema = z.object({
  conversations: z.number(),
  snapInterns: z.number(),
  months: z.number(),
  believers: z.number(),
  reviewedApplications: z.number(),
  interviewedCandidates: z.number(),
  workshops: z.number(),
  amas: z.number(),
  groupProjects: z.number(),
  leetcodeContests: z.number(),
});
