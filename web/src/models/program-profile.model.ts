import mongoose, { Document, Schema, Types } from 'mongoose';

interface IProgramProfile extends Document {
  programName: string;
  userId: Types.ObjectId;
  yearJoined: number;
  isActive: boolean;
  hobiies: string[];
  school: string;
  currentProfessionalTitle: string;
  isFounder: boolean;
  wereMentee: boolean;
  externalMentor: boolean;

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
    required: true,
  },
  yearJoined: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  hobiies: {
    type: [String],
    default: [],
  },
  school: {
    type: String,
    required: true,
  },
  currentProfessionalTitle: {
    type: String,
    required: true,
  },
  isFounder: {
    type: Boolean,
    required: true,
  },
  wereMentee: {
    type: Boolean,
    required: true,
  },
  externalMentor: {
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
