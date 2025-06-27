import { expect } from 'chai';
import { beforeEach, describe } from 'mocha';
import request from 'supertest';

import app from '@/app';
import { CronService } from '@/services/link/cron.service';
import { expectSuccessfulResponse } from '@/testutils/response-assertion.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

// Will add authentication test later on
describe('CronController', () => {
  const sandbox = useSandbox();
  let stubRunFunction: sinon.SinonStub;

  beforeEach(() => {
    stubRunFunction = sandbox.stub(CronService, 'runImmediately').resolves();
  });

  it('POST /cron/run-immediately', async () => {
    const res = await request(app).post('/api/cron/run-immediately');

    expectSuccessfulResponse({ res, statusCode: 200 });
    expect(res.body.message).to.equal(
      'Cron job has been triggered successfully.'
    );
    expect(stubRunFunction.calledOnce).to.equal(true);
  });
});
