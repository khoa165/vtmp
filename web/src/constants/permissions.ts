import { SystemRole, Permission } from '@vtmp/common/constants';

export const roleToPermissionMapping: Record<SystemRole, Permission[]> = {
  [SystemRole.ADMIN]: [
    Permission.VIEW_JOB_LINK,
    Permission.CREATE_JOB_LINK,
    Permission.MANAGE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,
    Permission.MANAGE_JOB_POSTING,

    Permission.VIEW_INVITATION,
    Permission.MANAGE_INVITATION,

    Permission.VIEW_APPLICATION,

    Permission.VIEW_INTERVIEW,
    Permission.VIEW_ALL_DATA,
    Permission.MANAGE_INTERVIEW,

    Permission.VIEW_VISUALIZATION,
  ],
  [SystemRole.MODERATOR]: [
    Permission.VIEW_JOB_LINK,
    Permission.CREATE_JOB_LINK,
    Permission.MANAGE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,
    Permission.MANAGE_JOB_POSTING,

    Permission.VIEW_INTERVIEW,
  ],
  [SystemRole.USER]: [
    Permission.VIEW_APPLICATION,
    Permission.MANAGE_APPLICATION,

    Permission.CREATE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,

    Permission.VIEW_INTERVIEW,
    Permission.MANAGE_INTERVIEW,
  ],
  [SystemRole.SERVICE]: [Permission.CREATE_JOB_LINK],
};
