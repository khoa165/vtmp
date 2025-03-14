import { expect } from 'chai';
import { getConfig } from './config';

describe('Config', () => {
  const MOCK_ENV = {
    MONGO_URI: 'https://google.com',
  };

  it('emptyEnvThrows', () => {
    Object.keys(MOCK_ENV).forEach((key) => {
      delete process.env[key];
    });
    expect(getConfig).to.throw();
  });

  it('allEnvPresentPasses', () => {
    Object.entries(MOCK_ENV).forEach(([key, value]) => {
      process.env[key] = value;
    });
    expect(getConfig).to.not.throw();
  });
});
