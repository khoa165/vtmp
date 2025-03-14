import User from '@/models/user.model.ts';

const UserRepository = {
  create: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const user = new User(userData);
    await user.save();
    return user;
  },

  findByEmail: async (email: string) => {
    return User.findOne({ email }).lean();
  },

  findById: async (id: string) => {
    return User.findById(id).lean();
  },
};

export default UserRepository;
