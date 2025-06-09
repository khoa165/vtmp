import { UserRole } from '@/types/enums';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
      service?: {
        role: UserRole;
      };
    }
  }
}
