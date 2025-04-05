import mongoose, { Document } from 'mongoose';
import { ProgramYear } from '@/types/enums';

interface IProjectActivity {
  year: ProgramYear;
  teamMembers: mongoose.Schema.Types.ObjectId[];
  projectAdvisors: mongoose.Schema.Types.ObjectId[];
}

interface IProject extends Document {
  teamName: string;
  teamNumber: number;
  activities: IProjectActivity[];
}

const ProjectSchema = new mongoose.Schema<IProject>({
  teamName: {
    type: String,
    required: true,
  },
  teamNumber: {
    type: Number,
    required: true,
  },
  activities: {
    type: [
      {
        year: {
          type: String,
          enum: Object.values(ProgramYear),
          required: true,
        },
        teamMembers: {
          type: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'ProgramProfile',
            },
          ],
          default: [],
        },
        projectAdvisors: {
          type: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'ProgramProfile',
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
});

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
