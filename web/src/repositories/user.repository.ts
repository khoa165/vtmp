import { IUser, Role, UserModel } from '@/models/user.model';

export const UserRepository = {
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    role?: Role;
  }): Promise<IUser> => {
    return UserModel.create(userData);
  },

  findUserByEmail: async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email });
  },

  findUserById: async (id: string): Promise<IUser | null> => {
    return UserModel.findById(id);
  },
};
