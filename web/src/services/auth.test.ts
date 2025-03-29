import { useMongoDB } from '@/config/mongodb.testutils';
import { beforeEach, describe } from 'mocha';
import AuthService from './auth.service';
import { expect } from 'chai';
import UserRepository from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConfig } from '@/config/config';
import { IUser, Role } from '@/types/interface';
import { hash } from 'crypto';

describe('Auth Service', () => {
  useMongoDB();
  const config = getConfig();

  beforeEach(async () => {
    const mockUser: IUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword: 'test password',
      role: Role.ADMIN,
    };
    await UserRepository.create(mockUser);
  });

  describe('Signup', () => {
    it('should fail to signup due to duplicate email', async () => {
      const userData: IUser = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'test',
        role: Role.ADMIN,
      };

      try {
        await AuthService.signup(userData);
      } catch (error: any) {
        console.log(error.message);
        expect(error.message).to.deep.equal(`Duplicate Email`);
      }
    });
  });

  describe('Signup', () => {
    it('should signup successfully', async () => {
      const userData: IUser = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test12@gmail.com',
        encryptedPassword: 'test',
        role: Role.ADMIN,
      };

      try {
        const user = await AuthService.signup(userData);
        expect(user).to.have.deep.property('firstName', userData.firstName);
        expect(user).to.have.deep.property('lastName', userData.lastName);
        expect(user).to.have.deep.property('email', userData.email);
        expect(user).to.have.deep.property('role', userData.role);
      } catch (error: any) {
        throw new Error('signup successfully but return wrong user data');
      }
    });
  });
});
