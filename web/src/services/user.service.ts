import UserRepository from '@/repositories/user.repository';

const UserService = {
  getProfile: async (userId: string) => {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

export default UserService;
