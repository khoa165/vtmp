import { UserModel } from '@vtmp/mongo/models';
import bcrypt from 'bcryptjs';

import { SystemRole } from '@vtmp/common/constants';

import { EnvConfig } from '@vtmp/mongo-migrations/env';

export const createAdmins = async () => {
  const emailsToUpdate = [
    {
      default: 'khoa.le@mentorship.com',
      actual: 'khoa1652000@gmail.com',
    },
  ];
  const encryptedPassword = await bcrypt.hash(
    EnvConfig.get().DEFAULT_ADMIN_PASSWORD,
    10
  );

  for (const email of emailsToUpdate) {
    await UserModel.findOneAndUpdate(
      {
        email: email.default,
      },
      {
        email: email.actual,
        encryptedPassword,
        role: SystemRole.ADMIN,
      }
    );
  }
};
