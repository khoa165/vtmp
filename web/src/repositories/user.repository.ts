import { IUser, UserModel } from '@vtmp/mongo/models';

import { SystemRole } from '@vtmp/common/constants';

export const UserRepository = {
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    role?: SystemRole;
  }): Promise<IUser> => {
    return UserModel.create(userData);
  },

  getAllUsers: async (): Promise<IUser[]> => {
    return UserModel.find({ deletedAt: null }, { encryptedPassword: 0 }).lean();
  },

  getUserByEmail: async (
    email: string,
    options?: {
      includePasswordField?: boolean;
    }
  ): Promise<IUser | null> => {
    return UserModel.findOne(
      { email, deletedAt: null },
      options?.includePasswordField ? {} : { encryptedPassword: 0 }
    ).lean();
  },

  getUserById: async (
    userId: string,
    options?: {
      includePasswordField?: boolean;
    }
  ): Promise<IUser | null> => {
    return UserModel.findOne(
      { _id: userId, deletedAt: null },
      options?.includePasswordField ? {} : { encryptedPassword: 0 }
    ).lean();
  },

  updateUserById: async (
    userId: string,
    updateUserInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      encryptedPassword?: string;
      role?: SystemRole;
    }
  ): Promise<IUser | null> => {
    return UserModel.findOneAndUpdate(
      { _id: userId, deletedAt: null },
      updateUserInfo,
      {
        new: true,
      }
    ).lean();
  },

  deleteUserById: async (userId: string): Promise<IUser | null> => {
    return UserModel.findOneAndUpdate(
      { _id: userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
