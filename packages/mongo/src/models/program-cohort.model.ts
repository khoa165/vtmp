import mongoose from 'mongoose';

interface IProgramCohort extends Document {
  year: number;
  menteeCount: number;
  mentorCount: number;

  // VTMP recruitment stats
  candidateApplications: number;
  candidateInterviews: number;

  // VTMP job search stats
  jobApplications: number;
  jobInterviews: number;
  jobOffers: number;

  // VTMP activities stats
  programWorkshops: number;
  programAMAs: number;
  programGroupProjects: number;
  programLeetcodeContests: number;
}

const ProgramCohortSchema = new mongoose.Schema<IProgramCohort>({
  year: {
    type: Number,
    required: true,
  },
  menteeCount: {
    type: Number,
    default: -1,
  },
  mentorCount: {
    type: Number,
    default: -1,
  },
  candidateApplications: {
    type: Number,
    default: -1,
  },
  candidateInterviews: {
    type: Number,
    default: -1,
  },
  jobApplications: {
    type: Number,
    default: -1,
  },
  jobInterviews: {
    type: Number,
    default: -1,
  },
  jobOffers: {
    type: Number,
    default: -1,
  },
  programWorkshops: {
    type: Number,
    default: -1,
  },
  programAMAs: {
    type: Number,
    default: -1,
  },
  programGroupProjects: {
    type: Number,
    default: -1,
  },
  programLeetcodeContests: {
    type: Number,
    default: -1,
  },
});

export const ProgramCohortModel = mongoose.model<IProgramCohort>(
  'ProgramCohort',
  ProgramCohortSchema
);
