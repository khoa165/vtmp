import { IUser, UserModel } from '@/models/user.model';
import { UserRole } from '@/types/enums';

export const UserRepository = {
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    role?: UserRole;
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
      role?: UserRole;
    }
  ): Promise<IUser | null> => {
    return UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
  },

  deleteUserById: async (id: string): Promise<IUser | null> => {
    return UserModel.findByIdAndDelete(id);
  },
};
