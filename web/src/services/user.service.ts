import { UserRepository } from '@/repositories/user.repository';
import { UserRole } from '@/types/enums';
import { ResourceNotFoundError } from '@/utils/errors';
import { excludePasswordFromUser } from '@/utils/transform';

const UserService = {
  getAllUsers: async () => {
    const users = await UserRepository.getAllUsers();

    return users.map((user) => excludePasswordFromUser(user));
  },

  getUserById: async (id: string) => {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { id });
    }

    return excludePasswordFromUser(user);
  },

  updateUserById: async (
    id: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    }
  ) => {
    const updatedUser = await UserRepository.updateUserById(id, updateData);

    if (!updatedUser) {
      throw new ResourceNotFoundError('User not found. Cannot update', { id });
    }

    return excludePasswordFromUser(updatedUser);
  },
};

export default UserService;
