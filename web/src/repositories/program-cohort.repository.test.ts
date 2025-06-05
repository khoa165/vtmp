import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import assert from 'assert';
import { useMongoDB } from '@/testutils/mongoDB.testutil';

chai.use(chaiSubset);
const { expect } = chai;

describe('ProgramCohortRepository', () => {
  useMongoDB();

  // const mockProgramCohort2023 = {};
});
