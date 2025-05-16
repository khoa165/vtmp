import { useMongoDB } from '@/testutils/mongoDB.testutil';
import * as chai from 'chai';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);
// const { expect } = chai;

describe('ProgramInvolvementRepository', () => {
  useMongoDB();
});
