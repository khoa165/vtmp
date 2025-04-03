import { Role } from '@/models/user.model';

enum Permission {
  GET_ALL_PENDING_JOB_LINKS = 'GET_ALL_PENDING_JOB_LINKS',
  APPROVE_JOB_LINK = 'APPROVE_JOB_LINK ',
  REJECT_JOB_LINK = 'REJECT_JOB_LINK',
  UPDATE_JOB_POSTING = 'UPDATE_JOB_POSTING',
  DELETE_JOB_POSTING = 'DELETE_JOB_POSTING',
  GET_ALL_INVITATIONS = 'GET_ALL_INVITATIONS',
  CREATE_INVITATION = 'CREATE_INVITATION',
  REVOKE_INVITATION = 'REVOKE_INVITATION',
}

// Mapping Role with Permission
const rolePermissionMapping = {
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
