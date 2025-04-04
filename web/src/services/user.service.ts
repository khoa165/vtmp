import UserRepository from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/user.model';

const UserService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET ?? 'vtmp-secret',
      { expiresIn: '1h' }
    );
    return token;
  },

  getProfile: async (userId: string) => {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
  createUser: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  },
  createMock: async () => {
    const mockUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: 'password123',
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        password: 'securePass456',
      },
      {
        name: 'Charlie Lee',
        email: 'charlie.lee@example.com',
        password: 'mySecret789',
      },
      {
        name: 'Diana Perez',
        email: 'diana.perez@example.com',
        password: 'qwerty321',
      },
      {
        name: 'Ethan Brown',
        email: 'ethan.brown@example.com',
        password: 'abc123xyz',
      },
      {
        name: 'Fiona Green',
        email: 'fiona.green@example.com',
        password: 'letMeIn123',
      },
      {
        name: 'George White',
        email: 'george.white@example.com',
        password: 'pass456word',
      },
      {
        name: 'Hannah Adams',
        email: 'hannah.adams@example.com',
        password: 'adminPass789',
      },
      {
        name: 'Ian Davis',
        email: 'ian.davis@example.com',
        password: 'hunterXx12',
      },
      {
        name: 'Jenna Moore',
        email: 'jenna.moore@example.com',
        password: 'passWord!@#',
      },
      {
        name: 'Kevin Taylor',
        email: 'kevin.taylor@example.com',
        password: 'kevinPass098',
      },
      {
        name: 'Laura Scott',
        email: 'laura.scott@example.com',
        password: 'lauraSecure456',
      },
      {
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        password: 'wilsonStrong1',
      },
      {
        name: 'Nina Clark',
        email: 'nina.clark@example.com',
        password: 'nina@2024',
      },
      {
        name: 'Oscar Young',
        email: 'oscar.young@example.com',
        password: 'oscarPass321',
      },
      {
        name: 'Paula King',
        email: 'paula.king@example.com',
        password: 'kingdom789',
      },
      {
        name: 'Quinn Baker',
        email: 'quinn.baker@example.com',
        password: 'qBak!2024',
      },
      {
        name: 'Rachel Hall',
        email: 'rachel.hall@example.com',
        password: 'rHall123!',
      },
      {
        name: 'Sam Turner',
        email: 'sam.turner@example.com',
        password: 'sammySecure',
      },
      {
        name: 'Tina Rivera',
        email: 'tina.rivera@example.com',
        password: 'tinapass456',
      },
    ];
    await User.insertMany(mockUsers);
  },
  getSingleUser: async (userId: string) => {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

export default UserService;
