import { useMongoDB } from '@/config/mongodb.testutils';
import { describe } from 'mocha';
import AuthService from './auth.service';
import { expect } from 'chai';
import UserRepository from '@/repositories/user.repository';

describe('Auth Service', () => {
  useMongoDB();

  describe('Login', () => {
    it('should throw error user not found', async () => {
      const userData = {
        email: 'testexample@gmail.com',
        password: 'test',
      };
      try {
        await AuthService.login(userData);
      } catch (error: any) {
        expect(error.message).to.equal('User not found');
      }
    });

    it('should throw error wrong password', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'testexample@gmail.com',
        encryptedPassword: 'enrypted-password-later',
      };
      await UserRepository.create(mockUser);
      const userData = {
        email: 'testexample@gmail.com',
        password: 'encrypted-password-later',
      };

      try {
        await AuthService.login(userData);
      } catch (error: any) {
        expect(error.message).to.equal('User not found');
      }
    });

    it('should login successfully and return valid jwt token', () => {});

    it('should login successfully and return token with correct user information', () => {});
  });
});
