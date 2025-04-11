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

  getAllUsers: async (): Promise<IUser[]> => {
    return UserModel.find({ deletedAt: null });
  },

  getUserByEmail: async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email, deletedAt: null });
  },

  getUserById: async (userId: string): Promise<IUser | null> => {
    return UserModel.findOne({ _id: userId, deletedAt: null });
  },

  updateUserById: async (
    userId: string,
    updateUserInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      encryptedPassword?: string;
      role?: UserRole;
    }
  ): Promise<IUser | null> => {
    return UserModel.findOneAndUpdate(
      { _id: userId, deletedAt: null },
      updateUserInfo,
      {
        new: true,
      }
    );
  },

  deleteUserById: async (userId: string): Promise<IUser | null> => {
    return UserModel.findOneAndUpdate(
      { _id: userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
