import { expect } from 'chai';
import sinon from 'sinon';

import { CronService } from '@/services/link/cron.service';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('CronService', () => {
  const sandbox = useSandbox();
  let stubRunFunction: sinon.SinonStub;

  beforeEach(() => {
    stubRunFunction = sandbox.stub(CronService, 'trigger').resolves();
  });

  it('should run immediately when called', async () => {
    await CronService.trigger();
    expect(stubRunFunction.calledOnce).to.equal(true);
  });
});
