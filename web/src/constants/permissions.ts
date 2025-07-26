import { SystemRole, Permission } from '@vtmp/common/constants';

const BASE_PERMISSIONS: Permission[] = [
  Permission.VIEW_APPLICATION,
  Permission.MANAGE_APPLICATION,

  Permission.CREATE_JOB_LINK,

  Permission.VIEW_JOB_POSTING,

  Permission.VIEW_INTERVIEW,
  Permission.MANAGE_INTERVIEW,
];

const ADDITIONAL_MODERATOR_PERMISSIONS: Permission[] = [
  Permission.VIEW_JOB_LINK,
  Permission.MANAGE_JOB_LINK,

  Permission.MANAGE_JOB_POSTING,
];

export const roleToPermissionMapping: Record<SystemRole, Permission[]> = {
  [SystemRole.ADMIN]: [
    ...BASE_PERMISSIONS,
    ...ADDITIONAL_MODERATOR_PERMISSIONS,

    Permission.VIEW_INVITATION,
    Permission.MANAGE_INVITATION,

    Permission.VIEW_ALL_DATA,

    Permission.VIEW_VISUALIZATION,
  ],
  [SystemRole.MODERATOR]: [
    ...BASE_PERMISSIONS,
    ...ADDITIONAL_MODERATOR_PERMISSIONS,
  ],
  [SystemRole.USER]: BASE_PERMISSIONS,
  [SystemRole.SERVICE]: [Permission.CREATE_JOB_LINK],
};
