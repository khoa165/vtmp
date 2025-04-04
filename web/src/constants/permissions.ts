import { Role, Permission } from '@/types/enums';

export const roleToPermissionMapping = {
  [Role.ADMIN]: [
    Permission.GET_ALL_PENDING_JOB_LINKS,
    Permission.APPROVE_JOB_LINK,
    Permission.REJECT_JOB_LINK,
    Permission.UPDATE_JOB_POSTING,
    Permission.DELETE_JOB_POSTING,
    Permission.GET_ALL_INVITATIONS,
    Permission.CREATE_INVITATION,
    Permission.REVOKE_INVITATION,
  ],
  [Role.MODERATOR]: [
    Permission.GET_ALL_PENDING_JOB_LINKS,
    Permission.APPROVE_JOB_LINK,
    Permission.REJECT_JOB_LINK,
    Permission.UPDATE_JOB_POSTING,
    Permission.DELETE_JOB_POSTING,
  ],
  [Role.USER]: [],
};
