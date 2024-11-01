import { genUserMock } from '@test/data/user.data';
import { createUser } from '@/lib/actions/user.actions';
import { UserModel } from '@/lib/database/models';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';

describe('Location Actions', () => {
  setupDatabaseTest();

  describe('createUser()', () => {
    it('should create one user', async () => {
      const userMock = genUserMock();
      await createUser(userMock);

      const allUsers = await UserModel.find();

      expect(allUsers).toHaveLength(1);
      expect(allUsers[0].username).toEqual(userMock.username);
    });
    it('should return the user as JSON not a MongoDb document', async () => {
      const userMock = genUserMock();

      const createUserRes = await createUser(userMock);

      expect(createUserRes).not.toBeInstanceOf(UserModel);
    });
  });
});
