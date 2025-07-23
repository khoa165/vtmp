import {
  ProgramCohortModel,
  ProgramProfileModel,
  UserModel,
  ProgramInvolvementModel,
} from '@vtmp/mongo/models';
import { splitFirstAndLastName } from '@vtmp/server-common/utils';
import mongoose, { ObjectId } from 'mongoose';
import { hasAtLeast, values } from 'remeda';

import { MentorshipRole } from '@vtmp/common/constants';
import { mentorshipPeople, MentorshipTerm } from '@vtmp/common/people';

export const backfillInvolvements = async () => {
  const session = await mongoose.startSession();
  try {
    const people = values(mentorshipPeople);

    await session.withTransaction(async () => {
      await Promise.all(
        [2023, 2024, 2025].map((year) =>
          ProgramCohortModel.findOneAndUpdate(
            { year },
            { year },
            { upsert: true, session }
          )
        )
      );

      const cohorts = await ProgramCohortModel.find({
        year: { $in: [2023, 2024, 2025] },
      });
      const cohortMap = new Map<number, ObjectId>();
      for (const cohort of cohorts) {
        cohortMap.set(cohort.year, cohort._id as ObjectId);
      }

      for (const person of people) {
        if (!hasAtLeast(person.terms, 1)) {
          console.log(`Skipping ${person.name}: No mentorship term found`);
          continue;
        }

        const { firstName, lastName } = splitFirstAndLastName(person.name);

        const user = await UserModel.findOne({
          firstName,
          lastName,
        });

        if (!user) {
          console.log(
            `Could not find user record for ${firstName} ${lastName}`
          );
          continue;
        }

        const oldProfile = await ProgramProfileModel.findOneAndDelete({
          userId: user._id,
        });

        if (!oldProfile) {
          console.log(
            `Could not find program profile record for ${firstName} ${lastName}`
          );
        }

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

        await ProgramProfileModel.create({
          trackingKey: person.trackingKey,
          programName: person.name,
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
          userId: user.id,
        });
      }

      for (const person of people) {
        if (!hasAtLeast(person.terms, 1)) {
          console.log(`Skipping ${person.name}: No mentorship term found`);
          continue;
        }

        const { firstName, lastName } = splitFirstAndLastName(person.name);

        const user = await UserModel.findOne({
          firstName,
          lastName,
        });

        if (!user) {
          console.log(
            `Could not find user record for ${firstName} ${lastName}`
          );
          continue;
        }

        const profile = await ProgramProfileModel.findOne({
          userId: user._id,
        });

        if (!profile) {
          console.log(
            `Could not find program profile record for ${firstName} ${lastName}`
          );
          continue;
        }

        for (const term of person.terms) {
          const cohortId = cohortMap.get(term.year);
          if (!cohortId) return;
          const programProfileId = profile._id as ObjectId;

          const mentors = await Promise.all(
            (term.mentors ?? []).map((mentorKey) =>
              ProgramProfileModel.findOne({ trackingKey: mentorKey })
            )
          );

          const mentorIds = mentors
            .filter((mentor) => mentor != null)
            .map((mentor) => mentor._id as ObjectId);

          const projectAdvisors = await Promise.all(
            (term.projectAdvisors ?? []).map((advisorKey) =>
              ProgramProfileModel.findOne({ trackingKey: advisorKey })
            )
          );

          const projectAdvisorIds = projectAdvisors
            .filter((advisor) => advisor != null)
            .map((advisor) => advisor._id as ObjectId);

          if (person.trackingKey === 'THANH_NGUYEN') {
            console.log(
              term.projectAdvisors?.length,
              projectAdvisors.length,
              projectAdvisorIds.length
            );
            console.log(projectAdvisorIds);
          }

          const menteeTrackingKeys: string[] = [];
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
              menteeTrackingKeys.push(otherPerson.trackingKey);
            }
          });

          const mentees = await Promise.all(
            menteeTrackingKeys.map((menteeKey) =>
              ProgramProfileModel.findOne({ trackingKey: menteeKey })
            )
          );

          const menteeIds = mentees
            .filter((mentee) => mentee != null)
            .map((mentee) => mentee._id as ObjectId);

          await ProgramInvolvementModel.create(
            [
              {
                programProfileId,
                programCohortId: cohortId,
                professionalTitle: term.title || person.professionalTitle,
                roles: term.roles,
                projects: [],
                careerMentors: mentorIds,
                projectMentors: projectAdvisorIds,
                mentees: menteeIds,
              },
            ],
            { session }
          );
        }
      }
    });

    console.log('Finished backfilling involvements!');
  } finally {
    await session.endSession();
  }
};
