import { UserRole } from 'generated/prisma';

export interface JwtPayload {
  email: string;
  sub: string; // user id
  role: UserRole;
}
