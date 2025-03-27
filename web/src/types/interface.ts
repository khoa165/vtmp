export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  role: Role;
}
