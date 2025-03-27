import User from '@/models/user.model';
import { Role, IUser } from '@/types/interface';
import bcrypt from 'bcryptjs';

const UserRepository = {
  create: async (userData: IUser) => {
    const saltRounds = 10; // The number of rounds to use for salt generation

    // Encrypt password
    userData.encryptedPassword = await bcrypt.hash(
      userData.encryptedPassword,
      saltRounds
    );

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
