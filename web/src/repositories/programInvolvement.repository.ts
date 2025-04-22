import {
  IProgramInvolvement,
  ProgramInvolvementModel,
} from '@/models/program-involvement.model';
import { Department, ProgramRole } from '@/types/enums';
import { Types } from 'mongoose';

export const ProgramInvolvementRepository = {
  createProgramInvolvement: async (ProgramInvolvementData: {
    programProfileId: Types.ObjectId;
    programCohortId: Types.ObjectId;
    professionalTitle: string;
    department: Department;
    roles: ProgramRole[];
    projects: Types.ObjectId[];
    mentees: Types.ObjectId[];
    mentors: Types.ObjectId[];
  }): Promise<IProgramInvolvement> => {
    return ProgramInvolvementModel.create(ProgramInvolvementData);
  },

  getProgramInvolvementByInvolvementId: async (
    ProgramInvolvementId: string
  ): Promise<IProgramInvolvement | null> => {
    return ProgramInvolvementModel.findOne({
      _id: ProgramInvolvementId,
    }).lean();
  },

  getAllProgramInvolvementsByProfileId: async (
    ProgramProfileId: string
  ): Promise<IProgramInvolvement[]> => {
    return ProgramInvolvementModel.find({
      programProfileId: ProgramProfileId,
    }).lean();
  },
};
