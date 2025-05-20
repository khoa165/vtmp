import { UserRole, Permission } from '@vtmp/common/constants';

export const roleToPermissionMapping: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_JOB_LINK,
    Permission.CREATE_JOB_LINK,
    Permission.MANAGE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,
    Permission.MANAGE_JOB_POSTING,

    Permission.VIEW_INVITATION,
    Permission.MANAGE_INVITATION,

    Permission.VIEW_APPLICATION,

    Permission.VIEW_INTERVIEW,
    Permission.VIEW_INTERVIEW_STATS,
    Permission.MANAGE_INTERVIEW,
  ],
  [UserRole.MODERATOR]: [
    Permission.VIEW_JOB_LINK,
    Permission.CREATE_JOB_LINK,
    Permission.MANAGE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,
    Permission.MANAGE_JOB_POSTING,

    Permission.VIEW_INTERVIEW,
  ],
  [UserRole.USER]: [
    Permission.VIEW_APPLICATION,
    Permission.MANAGE_APPLICATION,

    Permission.CREATE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,

    Permission.VIEW_INTERVIEW,
    Permission.MANAGE_INTERVIEW,
  ],
};
