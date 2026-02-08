import { z } from 'zod';

import { VISUALIZATION_STAT } from '@vtmp/common/constants';

export const ApplicationsCountByUserSchema = z.array(
  z.object({
    count: z.number(),
    name: z.string(),
  })
);

export const JobPostingsTrendByWeekSchema = z.array(
  z.object({
    count: z.number(),
    year: z.number(),
    startDate: z.string(),
    endDate: z.string(),
  })
);

export const VisualizationSchema = z.object({
  message: z.string(),
  data: z.object({
    [VISUALIZATION_STAT.APPLICATIONS_COUNT]: ApplicationsCountByUserSchema,
    [VISUALIZATION_STAT.JOB_POSTINGS_TREND]: JobPostingsTrendByWeekSchema,
  }),
});

export type JobPostingsTrendByWeek = z.infer<
  typeof JobPostingsTrendByWeekSchema
>;
