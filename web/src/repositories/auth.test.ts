import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import UserRepository from '@/repositories/user.repository';
import { useMongoDB } from '@/config/mongodb.testutils';

chai.use(chaiSubset);
const { expect } = chai;

describe('AuthenticationRepository', () => {
  useMongoDB();
});
