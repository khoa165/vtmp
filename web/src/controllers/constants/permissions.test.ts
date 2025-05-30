import { expect } from 'chai';
import { roleToPermissionMapping } from '@/controllers/constants/permissions';
import { Permission, UserRole } from '@vtmp/common/constants';

describe('roleToPermissionMapping', () => {
  it('should ensure every permission associated with at least a role', async () => {
    Object.values(Permission).forEach((permission) => {
      const isAssigned = Object.values(UserRole).some((role) =>
        roleToPermissionMapping[role].includes(permission)
      );
      expect(isAssigned).to.equal(true);
    });
  });
});
