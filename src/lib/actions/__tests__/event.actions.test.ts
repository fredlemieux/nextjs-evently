import { seedUserLocationAndCategory } from '@test/seeds';
import {
  genCreateEventActionParams,
  genEventMock,
} from '@test/data/event.data';
import { createEvent } from '@/lib/actions/event.actions';
import { faker } from '@faker-js/faker';
import { EventModel } from '@/lib/database/models';
import { revalidatePath } from 'next/cache';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { revalidateEvents } from 'swr/_internal';

jest.mock('next/cache');
// https://stackoverflow.com/questions/48759035/mock-dependency-in-jest-with-typescript
const revalidatePathMock = <jest.Mock<typeof revalidatePath>>revalidatePath;

describe('Event Actions', () => {
  setupDatabaseTest();

  beforeEach(() => {
    revalidatePathMock.mockReset();
  });

  describe('createEvent()', () => {
    it('should create one event with the same data', async () => {
      const { locationSeed, categorySeed, userSeed } =
        await seedUserLocationAndCategory();

      const eventMock = genCreateEventActionParams({
        locationId: locationSeed._id,
        categoryId: categorySeed._id,
        userId: userSeed._id,
      });

      const pathMock = `/${faker.internet.domainWord()}`;

      const createEventRes = await createEvent({
        event: eventMock,
        path: pathMock,
      });

      const allEvents = await EventModel.find();

      expect(allEvents).toHaveLength(1);
      expect(createEventRes).toMatchObject({ eventMock });
    });
  });
});
