import { IUser, UserModel } from '@/models/user.model';
import { Role } from '@/types/enums';

export const UserRepository = {
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
  }): Promise<IUser> => {
    return UserModel.create(userData);
  },

  findAllUsers: async (): Promise<IUser[]> => {
    return UserModel.find();
  },

  findUserByEmail: async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email });
  },

  findUserById: async (id: string): Promise<IUser | null> => {
    return UserModel.findById(id);
  },

  updateUserById: async (
    id: string,
    updatedUser: {
      firstName?: string;
      lastName?: string;
      email?: string;
      encryptedPassword?: string;
      role?: Role;
    }
  ): Promise<IUser | null> => {
    return UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
  },

  deleteUserById: async (id: string): Promise<IUser | null> => {
    return UserModel.findByIdAndDelete(id);
  },
};
