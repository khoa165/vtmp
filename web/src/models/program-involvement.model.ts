import { Department, UserRole } from '@/types/enums';
import mongoose, { Document } from 'mongoose';

interface IProgramInvolvement extends Document {
  programProfileId: mongoose.Schema.Types.ObjectId;
  programCohortId: mongoose.Schema.Types.ObjectId;
  title: string;
  department: Department;
  roles: UserRole[];
  projects: mongoose.Schema.Types.ObjectId[];
  mentees: mongoose.Schema.Types.ObjectId[];
  mentors: mongoose.Schema.Types.ObjectId[];
}

const ProgramInvolvementSchema = new mongoose.Schema<IProgramInvolvement>({
  programProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProgramProfile',
    required: true,
  },
  programCohortId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProgramCohort',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    enum: Object.values(Department),
    required: true,
  },
  roles: {
    type: [
      {
        type: String,
        enum: Object.values(UserRole),
        required: true,
      },
    ],
    default: [],
  },
  projects: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    default: [],
  },
  mentees: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramProfile',
      },
    ],
    default: [],
  },
  mentors: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramProfile',
      },
    ],
    default: [],
  },
});

export const ProgramInvolvementModel = mongoose.model<IProgramInvolvement>(
  'ProgramInvolvement',
  ProgramInvolvementSchema
);
