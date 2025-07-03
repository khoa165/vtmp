import { expect } from 'chai';
import sinon from 'sinon';

import { EnvConfig } from '@/config/env';
import { CronService } from '@/services/link/cron.service';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('CronService', () => {
  const sandbox = useSandbox();
  let stubRunFunction: sinon.SinonStub;

  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    stubRunFunction = sandbox.stub(CronService, 'trigger').resolves();
  });

  it('should run immediately when called', async () => {
    await CronService.trigger();
    expect(stubRunFunction.calledOnce).to.equal(true);
  });
});
