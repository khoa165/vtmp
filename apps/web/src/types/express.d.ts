import { SystemRole } from '@/types/enums';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: SystemRole;
      };
      service?: {
        role: SystemRole;
      };
    }
  }
}
