import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { roleToPermissionMapping } from '@/constants/constants';
import { Permission, Role } from '@/types/enums';

chai.use(chaiSubset);
const { expect } = chai;
describe('RoleToPermissionMapping', () => {
  useMongoDB();

  it('should ensure every permission associated with at least a role', async () => {
    const allPermissions = Object.values(Permission);
    const allUserRoles = Object.values(Role);

    for (const permission of allPermissions) {
      let isAssigned = false;
      for (const role of allUserRoles) {
        if (roleToPermissionMapping[role].includes(permission)) {
          isAssigned = true;
        }
      }
      expect(isAssigned).to.eq(true);
    }
  });
});
