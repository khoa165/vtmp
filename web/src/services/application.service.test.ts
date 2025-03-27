import { expect } from 'chai';

import ApplicationService from './application.service';
import { useMongoDB } from '@/config/mongodb.testutils';

describe('ApplicationService', () => {
  useMongoDB();

  describe('createApplication', () => {
    it('should throw error if job posting does not exist', () => {});

    it('should throw error if an application associated with this job posting and user already exist', () => {});

    it('should create an application successfully', () => {});
  });
});
