import { Types } from 'mongoose';
import { JwtPayload } from '@clerk/types';
import { faker } from '@faker-js/faker';

export function genClerkJwtAuth({
  userId,
  sub,
  withUserId = true,
}: {
  userId?: string;
  sub?: string;
  withUserId?: boolean;
} = {}): { sessionClaims: JwtPayload } {
  const userItem = withUserId
    ? {
        userId: userId || new Types.ObjectId().toString(), // user customer property
      }
    : {};

  return {
    sessionClaims: {
      ...userItem,
      __raw: faker.internet.jwt(), // Raw token
      iss: faker.string.uuid(), // Issuer
      sub: sub || faker.string.uuid(), // This is the clerk user ID,
      sid: faker.string.uuid(), // Session ID
      nbf: faker.date.past().getTime(),
      exp: faker.date.future().getTime(),
      iat: new Date().getTime(),
    },
  };
}
