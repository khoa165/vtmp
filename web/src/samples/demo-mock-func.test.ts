import { expect } from 'chai';

import { EnvConfig } from '@/config/env';
import { helloPort } from '@/samples/demo-mock-func';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('helloPort', () => {
  const sandbox = useSandbox();

  it('should return the correct greeting with the port', () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    const result = helloPort();
    expect(result).to.equal(`hello ${MOCK_ENV.PORT}`);
  });
});
