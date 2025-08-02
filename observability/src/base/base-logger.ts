import { SystemRole } from '@vtmp/common/constants';

export interface BaseLogger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  setUser(user: { id: string; email: string; role: SystemRole }): void;
}
