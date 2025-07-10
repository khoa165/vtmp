import { faker } from '@faker-js/faker';
import { JWTUtils } from '@vtmp/server-common/utils';
import { addDays } from 'date-fns';

import { EnvConfig } from '@/config/env';
import { InvitationModel } from '@/models/invitation.model';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

export const loadInvitations = async (count: number) => {
  const invitationsData = Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const receiverName = `${firstName} ${lastName}`;
    const receiverEmail = faker.internet.email({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
    });
    const sender = getNewMongoId();
    const token = JWTUtils.createTokenWithPayload(
      { receiverEmail },
      EnvConfig.get().JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      receiverName,
      receiverEmail,
      sender,
      token,
      expiryDate: addDays(new Date(), 7),
    };
  });

  const invitations = await Promise.all(
    invitationsData.map((invitation) => InvitationModel.create(invitation))
  );

  console.log(`Successfully seeded ${invitations.length} invitations.`);
  return invitations;
};
