import mongoose, { Document, Schema, Types } from 'mongoose';

import { MentorshipRole } from '@vtmp/common/constants';

export interface IProgramInvolvement extends Document {
  programProfileId: Types.ObjectId;
  programCohortId: Types.ObjectId;
  professionalTitle: string;
  roles: MentorshipRole[];
  projects: Types.ObjectId[];
  mentees: Types.ObjectId[];
  careerMentors: Types.ObjectId[];
  projectMentors: Types.ObjectId[];
}

const ProgramInvolvementSchema = new mongoose.Schema<IProgramInvolvement>(
  {
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
    roles: {
      type: [
        {
          type: String,
          enum: Object.values(MentorshipRole),
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
    careerMentors: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'ProgramProfile',
        },
      ],
      default: [],
    },
    projectMentors: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'ProgramProfile',
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const ProgramInvolvementModel = mongoose.model<IProgramInvolvement>(
  'ProgramInvolvement',
  ProgramInvolvementSchema
);
