import { Department, ProgramRole } from '@/types/enums';
import mongoose, { Document, Schema, Types } from 'mongoose';

interface IProgramInvolvement extends Document {
  programProfileId: Types.ObjectId;
  programCohortId: Types.ObjectId;
  professionalTitle: string;
  department: Department;
  roles: ProgramRole[];
  projects: Types.ObjectId[];
  mentees: Types.ObjectId[];
  mentors: Types.ObjectId[];
}

const ProgramInvolvementSchema = new Schema<IProgramInvolvement>({
  programProfileId: {
    type: Schema.Types.ObjectId,
    ref: 'ProgramProfile',
    required: true,
  },
  programCohortId: {
    type: Schema.Types.ObjectId,
    ref: 'ProgramCohort',
    required: true,
  },
  professionalTitle: {
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
        enum: Object.values(ProgramRole),
        required: true,
      },
    ],
    default: [],
  },
  projects: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    default: [],
  },
  mentees: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProgramProfile',
      },
    ],
    default: [],
  },
  mentors: {
    type: [
      {
        type: Schema.Types.ObjectId,
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
