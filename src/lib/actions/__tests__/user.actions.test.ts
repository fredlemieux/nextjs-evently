import { genUserMock } from '@test/data/user.data';
import {
  createUser,
  deleteUser,
  getSessionUserId,
  getUserById,
  updateUserByClerkId,
} from '@/lib/actions/user.actions';
import { EventModel, UserModel } from '@/lib/database/models';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { seedUser } from '@test/seeds/user.seed';
import { auth } from '@clerk/nextjs/server';
import { genClerkJwtAuth } from '@test/data/clerk.data';
import { faker } from '@faker-js/faker';
import { revalidatePath } from 'next/cache';
import { seedEvent } from '@test/seeds/event.seed';

jest.mock('next/cache');
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

const revalidatePathMock = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;

// jest.MockedFunction<typeof auth> causes problems as we'd have to mock the Auth object which isn't exported
const authMock = auth as unknown as jest.Mock;

afterEach(() => {
  authMock.mockReset();
  revalidatePathMock.mockReset();
});

describe('Location Actions', () => {
  setupDatabaseTest();

  describe('createUser()', () => {
    it('should create one user', async () => {
      const userMock = genUserMock();
      await createUser(userMock);

      const allUsers = await UserModel.find();

      expect(allUsers).toHaveLength(1);
      expect(allUsers[0]).toMatchObject(userMock);
    });

    it('should return the user as JSON not a MongoDb document', async () => {
      const userMock = genUserMock();

      const createUserRes = await createUser(userMock);

      expect(createUserRes).not.toBeInstanceOf(UserModel);
    });
  });

  describe('getUserById()', () => {
    it('should return user in JSON format with string Id', async () => {
      const userMock = genUserMock();
      const userSeed = await seedUser(userMock);
      const userId = userSeed._id.toString();

      const getUserRes = await getUserById(userId);

      expect(getUserRes).toMatchObject(userMock);
      expect(getUserRes).not.toBeInstanceOf(UserModel);
    });

    it('should return user in JSON format with ObjectId', async () => {
      const userMock = genUserMock();
      const userSeed = await seedUser(userMock);
      const userId = userSeed._id.toString();

      const getUserRes = await getUserById(userId);

      expect(getUserRes).toMatchObject(userMock);
      expect(getUserRes).not.toBeInstanceOf(UserModel);
    });
  });

  describe('updateUserByClerkId()', () => {
    it('should update the user and return new user data in JSON format', async () => {
      const userSeed = await seedUser();
      const clerkId = userSeed.clerkId;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { clerkId: notNeeded, ...updateUserMock } = genUserMock();

      const updateUserRes = await updateUserByClerkId(clerkId, updateUserMock);

      expect(updateUserRes).toMatchObject(updateUserMock);
      expect(updateUserRes).not.toBeInstanceOf(UserModel);
    });
  });

  describe('deleteUser()', () => {
    describe('Error Handling', () => {
      it('should throw an error if user does not exist', async () => {
        const clerkIdMock = faker.string.uuid();

        await expect(deleteUser(clerkIdMock)).rejects.toThrowError(
          'User not found'
        );
      });

      it('should delete the user if they exist', async () => {
        const userSeed = await seedUser();
        await seedUser(); // Seed another user to check it doesn't get deleted;

        await deleteUser(userSeed.clerkId);

        const allUsers = await UserModel.find({});

        expect(allUsers).toHaveLength(1);
        expect(allUsers[0].clerkId).not.toEqual(userSeed.clerkId);
      });

      it('should remove the createdBy field from events createdBy the user', async () => {
        const { userSeedModel } = await seedEvent();

        await deleteUser(userSeedModel.clerkId);

        const allEvents = await EventModel.find({});

        expect(allEvents).toHaveLength(1);
        expect(allEvents[0].createdBy).toBeUndefined();
      });

      it('should revalidate the home page', async () => {
        const { userSeedModel } = await seedEvent();

        await deleteUser(userSeedModel.clerkId);

        expect(revalidatePath).toHaveBeenCalledTimes(1);
        expect(revalidatePath).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('getSessionUserId()', () => {
    it('should return the userId from session claims if it exists', async () => {
      const clerkJwtAuthMock = genClerkJwtAuth();

      authMock.mockResolvedValueOnce(clerkJwtAuthMock);

      const sessionUserId = await getSessionUserId();

      expect(sessionUserId).toEqual(clerkJwtAuthMock.sessionClaims.userId);
    });

    it('should return null if no session claims exists or user is not in the database', async () => {
      authMock.mockResolvedValue({});

      const sessionUserId = await getSessionUserId();

      expect(sessionUserId).toBeNull();
    });

    it('should return userId if none exists in the sessionClaims but clerkId exists in database', async () => {
      const userSeed = await seedUser();
      const clerkJwtAuthMock = genClerkJwtAuth({
        sub: userSeed.clerkId,
        withUserId: false,
      });

      authMock.mockResolvedValueOnce(clerkJwtAuthMock);

      const sessionUserId = await getSessionUserId();

      expect(sessionUserId).toEqual(userSeed._id.toString());
    });
  });

  describe('getUserIdFromSessionClaims()', () => {});
});
