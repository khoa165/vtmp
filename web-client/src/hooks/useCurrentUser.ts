import { z } from 'zod';

import { SystemRole } from '@vtmp/common/constants';

const RawUserSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.nativeEnum(SystemRole),
});
type UserType = z.infer<typeof RawUserSchema>;

export const useCurrentUser = (): UserType | null => {
  const rawUser = localStorage.getItem('user');
  let user: UserType | null = null;
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      user = RawUserSchema.parse(parsed);
    } catch {
      user = null;
    }
  }
  return user;
};
