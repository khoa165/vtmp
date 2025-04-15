import { UserRepository } from '@/repositories/user.repository';
import { UserRole } from '@common/enums';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';
import * as R from 'remeda';

const UserService = {
  getAllUsers: async () => {
    return UserRepository.getAllUsers();
  },

  getUserById: async (id: string) => {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { id });
    }

    return R.omit(user, ['encryptedPassword']);
  },

  updateUserById: async (
    id: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: UserRole;
    }
  ) => {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new ResourceNotFoundError('User not found. Cannot update', { id });
    }

    if (updateData.email) {
      if (user.email != updateData.email) {
        const user = await UserRepository.getUserByEmail(updateData.email);
        if (user) {
          throw new DuplicateResourceError('This email is already taken', {
            id,
            email: updateData.email,
          });
        }
      }
    }

    const updatedUser = await UserRepository.updateUserById(id, updateData);
    if (!updatedUser) {
      throw new ResourceNotFoundError('User not found. Cannot update', { id });
    }

    return R.omit(updatedUser, ['encryptedPassword']);
  },
};

export default UserService;
