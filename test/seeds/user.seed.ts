import { genUserMock } from '@test/data/user.data';
import { IUser, UserModel } from '@/lib/database/models';

export async function seedUser(): Promise<IUser> {
  const userMock = genUserMock();
  return await UserModel.create(userMock);
}
