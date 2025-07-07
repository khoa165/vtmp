import { ProgramProfileModel, UserModel } from '@vtmp/mongo/models';
import { useMongoDB } from '@vtmp/mongo/utils';
import { splitFirstAndLastName } from '@vtmp/server-common/utils';
import mongoose from 'mongoose';
import { hasAtLeast, values } from 'remeda';

import { MentorshipRole, SystemRole } from '@vtmp/common/constants';
import { mentorshipPeople } from '@vtmp/common/people';
import type { MentorshipTerm } from '@vtmp/common/people';

import { EnvConfig } from '@vtmp/mongo-migrations/env';

export const migratePeople = async () => {
  await useMongoDB(EnvConfig.get().MONGO_URI);
  const client = mongoose.connection.getClient();

  try {
    // Start a session for transactions
    const session = client.startSession();

    try {
      const people = values(mentorshipPeople);
      const totalPeople = people.length;

      console.log(`Processing ${totalPeople} people in a single batch`);

      await session.withTransaction(async () => {
        // Prepare batch data
        const userBatch = [];
        const programProfileBatch = [];

        for (const person of people) {
          if (!hasAtLeast(person.terms, 1)) {
            console.log(`Skipping ${person.name}: No mentorship term found`);
            continue;
          }

          const { firstName, lastName } = splitFirstAndLastName(person.name);

          // Prepare user data
          userBatch.push({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName?.toLowerCase()}@mentorship.com`,
            encryptedPassword: 'password',
            role: SystemRole.USER,
            activated: false,
          });

          // Prepare program profile data (will be created after users)
          const term2025 = person.terms.find(
            (t: MentorshipTerm) => t.year === 2025
          );
          const currentRoles =
            term2025?.roles.filter(
              (role: MentorshipRole) =>
                ![
                  MentorshipRole.SWE_INACTIVE_LEAD,
                  MentorshipRole.SWE_EXMENTEE_INACTIVE_MENTOR,
                  MentorshipRole.COMMUNITY_MEMBER,
                ].includes(role)
            ) ?? [];

          programProfileBatch.push({
            programName: person.name,
            // userId will be set after user creation
            yearJoined: person.terms[0].year,
            isActive: hasAtLeast(currentRoles, 1),
            hobbies: person.hobbies.split(', '),
            school: person.school,
            linkedin: person.linkedin,
            currentProfessionalTitle: person.professionalTitle,
            isFounder: person.isFounder ?? false,
            wasMentee: !person.hasNeverBeenMenteeOfProgram,
            wasExternallyRecruitedMentor: person.externallyRecruited ?? false,
            spreadsheetAlias: person.trackingName,
          });
        }

        // Create users in batch
        if (userBatch.length > 0) {
          const users = await UserModel.create(userBatch, {
            session,
            ordered: true,
          });
          console.log(`Created ${users.length} users in batch`);

          // Create program profiles in batch with user IDs
          if (programProfileBatch.length > 0) {
            const profilesWithUserIds = programProfileBatch.map(
              (profile, index) => {
                const user = users[index];
                if (!user) {
                  throw new Error(`User at index ${index} not found`);
                }
                return {
                  ...profile,
                  userId: user._id,
                };
              }
            );

            const profiles = await ProgramProfileModel.create(
              profilesWithUserIds,
              { session, ordered: true }
            );
            console.log(`Created ${profiles.length} program profiles in batch`);
            console.log(
              `Successfully migrated ${profiles.length} people in a single transaction!`
            );
          }
        }
      });

      console.log('Finished migrating people!');
    } finally {
      await session.endSession();
    }
  } finally {
    await client.close();
  }
};
