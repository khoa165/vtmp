import { expect } from 'chai';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { helloPort } from './demo-mock-func';
import { EnvConfig } from '@/config/env';

describe('helloPort', () => {
  const sandbox = useSandbox();

  const fakeEnvs = {
    PORT: 3000,
    MONGO_URI: '',
    JWT_SECRET: '',
  };

  it('should return the correct greeting with the port', () => {
    sandbox.stub(EnvConfig, 'get').returns(fakeEnvs);
    const result = helloPort();
    expect(result).to.equal(`hello ${fakeEnvs.PORT}`);
  });
});
