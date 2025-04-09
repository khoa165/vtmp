import mongoose, { Document } from 'mongoose';

interface IProgramProfile extends Document {
  programName: string;
  userId: mongoose.Schema.Types.ObjectId;
  yearJoined: number;
  isActive: boolean;
}

const ProgramProfileSchema = new mongoose.Schema<IProgramProfile>({
  programName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
});

export const ProgramProfileModel = mongoose.model<IProgramProfile>(
  'ProgramProfile',
  ProgramProfileSchema
);
