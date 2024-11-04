import { genUserMock } from '@test/data/user.data';
import {
  createUser,
  getUserById,
  updateUserByClerkId,
} from '@/lib/actions/user.actions';
import { UserModel } from '@/lib/database/models';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { seedUser } from '@test/seeds/user.seed';

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
    it.todo('');
  });

  describe('getSessionUserId()', () => {
    it.todo('');
  });

  describe('getUserIdFromSessionClaims()', () => {
    it.todo('');
  });
});
