import { ProgramProfileModel, UserModel } from '@vtmp/mongo/models';
import { useMongoDB } from '@vtmp/mongo/utils';

import assert from 'assert';

import { EnvConfig } from '@vtmp/mongo-migrations/env';

export const migratePeople = async () => {
  await useMongoDB(EnvConfig.get().MONGO_URI);
  const khoa = await UserModel.findOne({ firstName: 'Khoa' }).lean();
  assert(khoa);
  await ProgramProfileModel.create({
    programName: 'Khoa',
    userId: khoa._id,
    yearJoined: 2023,
    isActive: true,
    hobies: [],
    school: 'University of Wisconsin-Madison',
    currentProfessionalTitle: 'Mentor @ VTMP',
    isFounder: true,
    wasMentee: false,
    wasExternallyRecruitedMentor: false,
  });
};
