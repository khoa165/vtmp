import app from '@/app';
import { EnvConfig } from '@/config/env';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';
import { expect } from 'chai';

describe('hasPermission', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let token: string;

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    await UserRepository.createUser(mockUser);

    token = await AuthService.login({
      email: 'test@gmail.com',
      password: 'test password',
    });
  });

  it('should return forbidden error', (done) => {
    request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
        expect(res.body.errors[0].message).to.equal('Forbidden');
        done();
      });
  });
});
