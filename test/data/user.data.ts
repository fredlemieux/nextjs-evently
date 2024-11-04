import { CreateUserMongoParams } from '@/lib/database/models/user.model';
import { faker } from '@faker-js/faker';

export function genUserMock(): CreateUserMongoParams {
  return {
    clerkId: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    photo: faker.internet.url(),
    username: faker.internet.username(),
  };
}
