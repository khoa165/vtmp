import * as chai from 'chai';
import { roleToPermissionMapping } from '@/constants/permissions';
import { Permission, Role } from '@/types/enums';

const { expect } = chai;
describe('RoleToPermissionMapping', () => {
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
