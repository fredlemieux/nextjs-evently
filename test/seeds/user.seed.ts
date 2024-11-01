import { genUserMock } from '@test/data/user.data';
import { CreateUserMongoParams, IUser, UserModel } from '@/lib/database/models';

export async function seedUser(
  seedData?: CreateUserMongoParams
): Promise<IUser> {
  const userMock = seedData ? seedData : genUserMock();
  return await UserModel.create(userMock);
}
