import {
  IProgramProfile,
  ProgramProfileModel,
} from '@/models/program-profile.model';
import { Types } from 'mongoose';

export const ProgramProfileRepository = {
  createProgramProfile: async (ProgramProfileData: {
    programName: string;
    userId: Types.ObjectId;
    yearJoined: number;
    isActive: boolean;
    hobies: string[];
    school: string;
    currentProfessionalTitle: string;
    isFounder: boolean;
    wasMentee: boolean;
    wasExternallyRecruitedMentor: boolean;

    // temporary field
    spreadsheetAlias?: string;
  }): Promise<IProgramProfile> => {
    return ProgramProfileModel.create(ProgramProfileData);
  },

  getProgramProfileByUserId: async (
    userId: string
  ): Promise<IProgramProfile | null> => {
    return ProgramProfileModel.findOne({ userId: userId }).lean();
  },

  getProgramProfileByProfileId: async (
    ProgramProfileId: string
  ): Promise<IProgramProfile | null> => {
    return ProgramProfileModel.findOne({ _id: ProgramProfileId }).lean();
  },

  getAllProgramProfiles: async (): Promise<IProgramProfile[]> => {
    return ProgramProfileModel.find().lean();
  },
};
