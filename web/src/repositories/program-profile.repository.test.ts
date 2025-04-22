import { ProgramProfileRepository } from '@/repositories/program-profile.repository';
import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import * as chai from 'chai';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);
const { expect } = chai;

describe('Program-profileRepository', () => {
  useMongoDB();

  const user1 = {
    firstName: 'admin',
    lastName: 'viettech',
    email: 'test@example.com',
    encryptedPassword: 'ecnrypted-password-later',
  };

  const profileWithoutUserId = {
    programName: 'viettech',
    yearJoined: 2023,
    isActive: true,
    hobies: ['vtmp'],
    school: 'VTMP',
    currentProfessionalTitle: 'SWE intern @ VTMP',
    isFounder: false,
    wasMentee: true,
    wasExternallyRecruitedMentor: false,
  };

  const mockMultipleUsers = [
    {
      firstName: 'admin1',
      lastName: 'viettech',
      email: 'test1@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
    {
      firstName: 'admin2',
      lastName: 'viettech',
      email: 'test2@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
    {
      firstName: 'admin3',
      lastName: 'viettech',
      email: 'test3@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
    {
      firstName: 'admin4',
      lastName: 'viettech',
      email: 'test4@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
  ];

  const mockMultipleProgramProfiles = [
    {
      programName: 'admin1',
      yearJoined: 2023,
      isActive: true,
      hobies: ['vtmp'],
      school: 'VTMP',
      currentProfessionalTitle: 'Founder @ VTMP',
      isFounder: true,
      wasMentee: false,
      wasExternallyRecruitedMentor: false,
    },
    {
      programName: 'admin2',
      yearJoined: 2025,
      isActive: true,
      hobies: ['vtmp'],
      school: 'VTMP',
      currentProfessionalTitle: 'SWE intern @ VTMP',
      isFounder: false,
      wasMentee: true,
      wasExternallyRecruitedMentor: false,
    },
    {
      programName: 'admin4',
      yearJoined: 2024,
      isActive: true,
      hobies: ['vtmp'],
      school: 'VTMP',
      currentProfessionalTitle: 'Mentor @ VTMP',
      isFounder: false,
      wasMentee: true,
      wasExternallyRecruitedMentor: true,
    },
  ];

  describe('createProgramProfile', () => {
    it('should create a user and get the uid to create a program profile', async () => {
      const user = await UserRepository.createUser(user1);

      const programProfile =
        await ProgramProfileRepository.createProgramProfile({
          userId: user.id,
          ...profileWithoutUserId,
        });

      expect(programProfile).to.containSubset(profileWithoutUserId);
    });
  });

  describe('getProgramProfile', () => {
    it('should return no profile if user does not have program-profile', async () => {
      const users = await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );

      await Promise.all(
        mockMultipleProgramProfiles.map((profile) => {
          const uid = users.find(
            (u) => u.firstName === profile.programName
          )!.id;

          return ProgramProfileRepository.createProgramProfile({
            userId: uid,
            ...profile,
          });
        })
      );

      const profileAdmin3 =
        await ProgramProfileRepository.getProgramProfileByUserId(users[2]!.id);
      expect(profileAdmin3).to.be.a('null');
    });
  });

  //
});
