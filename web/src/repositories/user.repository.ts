import User from '@/models/user.model';

class UserRepository {
  static async create(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  static async findByEmail(email: string) {
    return User.findOne({ email });
  }

  static async findById(id: string) {
    return User.findById(id);
  }

  static async updatePassword(id: string, password: string) {
    return User.findByIdAndUpdate(id, { password }, { new: true });
  }
}

export default UserRepository;
