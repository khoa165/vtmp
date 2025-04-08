import { IUser } from '@/models/user.model';

export const excludePasswordFromUser = (user: IUser) => {
  const { encryptedPassword, ...fields } = user.toObject();
  return { ...fields };
};
