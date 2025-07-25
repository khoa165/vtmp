import {
  ProgramCohortModel,
  ProgramProfileModel,
  UserModel,
  ProgramInvolvementModel,
} from '@vtmp/mongo/models';
import { splitFirstAndLastName } from '@vtmp/server-common/utils';
import mongoose, { ObjectId } from 'mongoose';
import { hasAtLeast, values } from 'remeda';

import { MentorshipRole, SystemRole } from '@vtmp/common/constants';
import { mentorshipPeople } from '@vtmp/common/people';
import type { MentorshipTerm } from '@vtmp/common/people';

export const migratePeople = async () => {
  await Promise.all(
    [2023, 2024, 2025].map((year) =>
      ProgramCohortModel.create({
        year,
      })
    )
  );

  // Start a session for transactions
  const session = await mongoose.startSession();

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
          trackingKey: person.trackingKey,
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

          // Map year to cohortId for quick lookup
          const cohorts = await ProgramCohortModel.find({
            year: { $in: [2023, 2024, 2025] },
          });
          const cohortMap = new Map<number, ObjectId>();
          for (const cohort of cohorts) {
            cohortMap.set(cohort.year, cohort._id as ObjectId);
          }

          // Build lookup for (trackingKey, year) -> profileId
          const profileIdByTrackingKeyYear = new Map<string, ObjectId>();
          profiles.forEach((profile, idx) => {
            const person = people[idx];
            if (!person) return;
            person.terms.forEach((term) => {
              profileIdByTrackingKeyYear.set(
                `${person.trackingKey}-${term.year}`,
                profile._id as ObjectId
              );
            });
          });

          // Create involvement docs for each person/term, with mentors/mentees
          const involvementBatch: {
            programProfileId: ObjectId;
            programCohortId: ObjectId;
            professionalTitle: string;
            roles: MentorshipRole[];
            projects: ObjectId[];
            mentors: ObjectId[];
            mentees: ObjectId[];
          }[] = [];
          profiles.forEach((profile, idx) => {
            const person = people[idx];
            if (!person) return;
            person.terms.forEach((term: MentorshipTerm) => {
              const cohortId = cohortMap.get(term.year);
              if (!cohortId) return;
              const programProfileId = profile._id as ObjectId;

              // Mentors: look up by trackingKey and year
              const mentors = (term.mentors ?? [])
                .map((mentorKey) =>
                  profileIdByTrackingKeyYear.get(`${mentorKey}-${term.year}`)
                )
                .filter(Boolean) as ObjectId[];

              // Mentees: find all people who have this person as a mentor in the same year
              const mentees: ObjectId[] = [];
              people.forEach((otherPerson) => {
                if (otherPerson.trackingKey === person.trackingKey) return;
                const otherTerm = otherPerson.terms.find(
                  (t) => t.year === term.year
                );
                if (
                  otherTerm &&
                  (otherTerm.mentors ?? [])
                    .map((m) => m as string)
                    .includes(person.trackingKey as string)
                ) {
                  const menteeProfileId = profileIdByTrackingKeyYear.get(
                    `${otherPerson.trackingKey}-${term.year}`
                  );
                  if (menteeProfileId) mentees.push(menteeProfileId);
                }
              });

              involvementBatch.push({
                programProfileId,
                programCohortId: cohortId,
                professionalTitle: term.title || person.professionalTitle,
                roles: term.roles,
                projects: [],
                mentors,
                mentees,
              });
            });
          });
          if (involvementBatch.length > 0) {
            await ProgramInvolvementModel.create(involvementBatch, {
              session,
              ordered: true,
            });
            console.log(
              `Created ${involvementBatch.length} program involvement documents in batch`
            );
          }

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
};
