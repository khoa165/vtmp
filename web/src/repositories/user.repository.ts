import { IUser, UserModel } from '@/models/user.model';
import bcrypt from 'bcryptjs';

export const UserRepository = {
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
  }): Promise<IUser> => {
    const saltRounds = 10; // The number of rounds to use for salt generation

    // Encrypt password
    userData.encryptedPassword = await bcrypt.hash(
      userData.encryptedPassword,
      saltRounds
    );

    return UserModel.create(userData);
  },

  findUserByEmail: async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email });
  },

  findUserById: async (id: string): Promise<IUser | null> => {
    return UserModel.findById(id);
  },
};
