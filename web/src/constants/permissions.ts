import { UserRole, Permission } from '@/types/enums';

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
  ],
  [UserRole.MODERATOR]: [
    Permission.VIEW_JOB_LINK,
    Permission.CREATE_JOB_LINK,
    Permission.MANAGE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,
    Permission.MANAGE_JOB_POSTING,
  ],
  [UserRole.USER]: [
    Permission.VIEW_APPLICATION,
    Permission.MANAGE_APPLICATION,

    Permission.CREATE_JOB_LINK,

    Permission.VIEW_JOB_POSTING,
  ],
};
