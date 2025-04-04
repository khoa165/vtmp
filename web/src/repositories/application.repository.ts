import { ApplicationModel } from '@/models/application.model';

export const ApplicationRepository = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    return ApplicationModel.create({
      jobPostingId,
      userId,
    });
  },

  doesApplicationExist: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    return !!(await ApplicationModel.exists({
      jobPostingId,
      userId,
    }));
  },
};
