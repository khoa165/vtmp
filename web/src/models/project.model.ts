import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProjectActivity {
  year: number;
  teamMembers: Types.ObjectId[];
  projectAdvisors: Types.ObjectId[];
}

export interface IProject extends Document {
  teamName: string;
  teamNumber?: number;
  activities: IProjectActivity[];
}

const ProjectSchema = new Schema<IProject>({
  teamName: {
    type: String,
    required: true,
  },
  teamNumber: {
    type: Number,
  },
  activities: {
    type: [
      {
        year: {
          type: Number,
          required: true,
        },
        teamMembers: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: 'ProgramProfile',
            },
          ],
          default: [],
        },
        projectAdvisors: {
          type: [
            {
              type: Schema.Types.ObjectId,
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
