import { expect } from 'chai';
import { getConfig } from './config';
import { before } from 'mocha';

describe('Config', () => {
  let env: NodeJS.ProcessEnv;

  const MOCK_ENV = {
    MONGO_URI: 'https://google.com',
  };

  before(() => {
    env = JSON.parse(JSON.stringify(process.env));
    Object.keys(process.env).forEach((key) => {
      delete process.env[key];
    });
  });

  after(() => {
    process.env = env;
  });

  it('emptyEnvThrows', () => expect(getConfig).to.throw());

  it('allEnvPresentPasses', () => {
    Object.entries(MOCK_ENV).forEach(([key, value]) => {
      process.env[key] = value;
    });
    expect(getConfig).to.not.throw();
  });
});
