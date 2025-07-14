import { expect } from 'chai';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { helloPort } from '@/samples/demo-mock-func';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';

describe('helloPort', () => {
  const sandbox = useSandbox();

  it('should return the correct greeting with the port', () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    const result = helloPort();
    expect(result).to.equal(`hello ${MOCK_ENV.PORT}`);
  });
});
