import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import AuthService from './auth.service';
import { expect } from 'chai';
import UserRepository from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConfig } from '@/config/config';

describe('Auth Service', () => {
  useMongoDB();
  // const config = getConfig();

  beforeEach(async () => {
    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    await UserRepository.create(mockUser);
  });

  describe('Login', () => {
    it('should throw error user not found', async () => {
      const userData = {
        email: 'testnotfound@gmail.com',
        password: 'test password',
      };
      try {
        await AuthService.login(userData);
      } catch (error: any) {
        expect(error.message).to.equal('User not found');
      }
    });

    it('should throw error wrong password', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'wrong password',
      };

      try {
        await AuthService.login(userData);
      } catch (error: any) {
        expect(error.message).to.equal('Wrong password');
      }
    });

    it('should login successfully and return valid jwt token', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'test password',
      };

      try {
        const token = await AuthService.login(userData);
        jwt.verify(token, process.env.JWT_SECRET ?? 'vtmp-secret');
      } catch (error: any) {
        throw new Error('log in successfully but invalid jwt token');
      }
    });

    it('should login successfully and return token with user information', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'test password',
      };

      try {
        const token = await AuthService.login(userData);
        const { id } = jwt.verify(
          token,
          process.env.JWT_SECRET ?? 'vtmp-secret'
        ) as {
          id: string;
        };
        const user = await UserRepository.findById(id);
        expect(user).to.not.be.null;
      } catch (error: any) {
        throw new Error(
          'log in successfully but token not containing user information'
        );
      }
    });
  });
});
