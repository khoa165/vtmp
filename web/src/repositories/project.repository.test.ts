import { ProgramProfileRepository } from '@/repositories/program-profile.repository';
import { ProjectRepository } from '@/repositories/project.repository';
import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import * as chai from 'chai';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);
const { expect } = chai;

describe('ProjectRepository', () => {
  useMongoDB();

  const mockMultipleMentees = [
    {
      firstName: 'mentee1',
      lastName: 'viettech',
      email: 'mentee1@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
    {
      firstName: 'mentee2',
      lastName: 'viettech',
      email: 'mentee2@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
    {
      firstName: 'mentee3',
      lastName: 'viettech',
      email: 'mentee3@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    },
  ];

  const mockMultipleMenteesProfiles = [
    {
      programName: 'mentee1',
      yearJoined: 2023,
      isActive: true,
      hobies: ['vtmp'],
      school: 'VTMP',
      currentProfessionalTitle: 'mentee1 @ VTMP',
      isFounder: false,
      wasMentee: true,
      wasExternallyRecruitedMentor: false,
    },
    {
      programName: 'mentee2',
      yearJoined: 2025,
      isActive: true,
      hobies: ['vtmp'],
      school: 'VTMP',
      currentProfessionalTitle: 'mentee2 @ VTMP',
      isFounder: false,
      wasMentee: true,
      wasExternallyRecruitedMentor: false,
    },
    {
      programName: 'mentee3',
      yearJoined: 2024,
      isActive: true,
      hobies: ['vtmp'],
      school: 'VTMP',
      currentProfessionalTitle: 'mentee3 @ VTMP',
      isFounder: false,
      wasMentee: true,
      wasExternallyRecruitedMentor: false,
    },
  ];

  const mockOneProject = {
    teamName: 'team1',
    teamNumber: 1,
  };

  describe('createProject', () => {
    it('should create a project with empty array for activity field', async () => {
      const project = await ProjectRepository.createProject(mockOneProject);
      expect(project).to.have.property('activities').that.deep.equal([]);
    });

    it('should create project with one activity in 2025 and three members', async () => {
      const mentees = await Promise.all(
        mockMultipleMentees.map((mentee) => UserRepository.createUser(mentee))
      );

      // create 3 profiles
      const menteesProfiles = await Promise.all(
        mockMultipleMenteesProfiles.map((profile) => {
          const uid = mentees.find(
            (mentee) => mentee.firstName === profile.programName
          )!.id;

          return ProgramProfileRepository.createProgramProfile({
            userId: uid,
            ...profile,
          });
        })
      );

      // get list of mentees' profileId
      const menteesProfilesIds = menteesProfiles.map((profile) => profile.id);

      // create project
      const project = await ProjectRepository.createProject({
        ...mockOneProject,
        activities: [
          { year: 2025, teamMembers: menteesProfilesIds, projectAdvisors: [] },
        ],
      });

      expect(project.activities).to.have.lengthOf(1);
      expect(project)
        .to.have.nested.property('activities[0].teamMembers')
        .that.have.lengthOf(3);

      //
    });
  });
});
