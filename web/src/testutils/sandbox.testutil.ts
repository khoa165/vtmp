import sinon from 'sinon';

export const useSandbox = (): sinon.SinonSandbox => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });
  return sandbox;
};
