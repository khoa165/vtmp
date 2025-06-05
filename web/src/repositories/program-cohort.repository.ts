import {
  IProgramCohort,
  ProgramCohortModel,
} from '@/models/program-cohort.model';

export const ProgramCohortRepository = {
  // createProgramCohort
  createProgramCohort: async (year: number): Promise<IProgramCohort> => {
    return ProgramCohortModel.create({
      year,
    });
  },

  // getProgramCohorts
  getProgramCohorts: async (): Promise<IProgramCohort[]> => {
    return ProgramCohortModel.find({});
  },

  // getProgramCohortById
  getProgramCohortById: async (
    programCohortId: string
  ): Promise<IProgramCohort | null> => {
    return ProgramCohortModel.findOne({
      _id: programCohortId,
      deletedAt: null,
    });
  },

  // updateProgramCohortById
  updateProgramCohortById: async (
    programCohortId: string,
    updatedMetadata: {
      year?: number;
      menteeCount?: number;
      mentorCount?: number;
      candidateApplications?: number;
      candidateInterviews?: number;
      jobApplications?: number;
      jobInterviews?: number;
      jobOffers?: number;
      programWorkshops?: number;
      programAMAs?: number;
      programGroupProjects?: number;
      programLeetcodeContests?: number;
    }
  ): Promise<IProgramCohort | null> => {
    return ProgramCohortModel.findOneAndUpdate(
      { _id: programCohortId, deletedAt: null },
      { $set: updatedMetadata },
      { new: true }
    );
  },

  deleteProgramCohortById: async (
    programCohortId: string
  ): Promise<IProgramCohort | null> => {
    return ProgramCohortModel.findOneAndUpdate(
      { _id: programCohortId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
