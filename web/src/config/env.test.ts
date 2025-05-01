import { expect } from 'chai';
import { EnvConfig } from '@/config/env';
import { before } from 'mocha';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';

describe('Config', () => {
  let env: NodeJS.ProcessEnv;

  // const MOCK_ENV = {
  //   MONGO_URI: 'mongodb://username:password@localhost:27017/database_name',
  //   PORT: '8000',
  //   JWT_SECRET: 'some-random-secret-here',
  //   GMAIL_EMAIL: 'vtmpwebsite2025@gmail.com',
  //   GMAIL_APP_PASSWORD: 'azpj ibvt glaf ebcy',
  // };

  before(() => {
    env = JSON.parse(JSON.stringify(process.env));
    Object.keys(process.env).forEach((key) => {
      delete process.env[key];
    });
  });

  after(() => {
    process.env = env;
  });

  it('should throw when env is empty', () => expect(EnvConfig.get).to.throw());

  it('should pass when env are present', () => {
    Object.entries(MOCK_ENV).forEach(([key, value]) => {
      process.env[key] = value.toString();
    });
    expect(EnvConfig.get).to.not.throw();
  });
});
