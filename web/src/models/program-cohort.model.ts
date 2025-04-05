import mongoose from 'mongoose';

interface IProgramCohort extends Document {
  menteeCount: number;
  mentorCount: number;
}

const ProgramCohortSchema = new mongoose.Schema<IProgramCohort>({
  menteeCount: {
    type: Number,
    default: 0,
  },
  mentorCount: {
    type: Number,
    default: 0,
  },
});

export const ProgramCohortModel = mongoose.model<IProgramCohort>(
  'ProgramCohort',
  ProgramCohortSchema
);
