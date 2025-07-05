import mongoose, { Document, Schema, Types } from 'mongoose';

interface IProgramProfile extends Document {
  programName: string;
  userId: Types.ObjectId;
  yearJoined: number;
  isActive: boolean;
  hobbies: string[];
  currentProfessionalTitle: string;
  isFounder: boolean;
  wasMentee: boolean;
  wasExternallyRecruitedMentor: boolean;

  // temporary field
  spreadsheetAlias: string;
}

const ProgramProfileSchema = new mongoose.Schema<IProgramProfile>({
  programName: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  yearJoined: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  hobbies: {
    type: [String],
    default: [],
  },
  currentProfessionalTitle: {
    type: String,
    required: true,
  },
  isFounder: {
    type: Boolean,
    required: true,
  },
  wasMentee: {
    type: Boolean,
    required: true,
  },
  wasExternallyRecruitedMentor: {
    type: Boolean,
    required: true,
  },

  // temporary field
  spreadsheetAlias: {
    type: String,
  },
});

export const ProgramProfileModel = mongoose.model<IProgramProfile>(
  'ProgramProfile',
  ProgramProfileSchema
);
