import { seedUserLocationAndCategory } from '@test/seeds';
import { genCreateEventActionParams } from '@test/data/event.data';
import { createEvent, getEventById } from '@/lib/actions/event.actions';
import { faker } from '@faker-js/faker';
import { EventModel } from '@/lib/database/models';
import { revalidatePath } from 'next/cache';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { ToJSON } from '@/types/utility.types';

jest.mock('next/cache');
// https://stackoverflow.com/questions/48759035/mock-dependency-in-jest-with-typescript
const revalidatePathMock = <jest.Mock<typeof revalidatePath>>revalidatePath;

describe('Event Actions', () => {
  setupDatabaseTest();

  beforeEach(() => {
    revalidatePathMock.mockReset();
  });

  function convertMockToJSON<T>(object: T): ToJSON<T> {
    return JSON.parse(JSON.stringify(object));
  }

  describe('createEvent()', () => {
    async function setupCreateEventTest() {
      const { locationSeed, categorySeed, userSeed } =
        await seedUserLocationAndCategory();

      const { locationId, categoryId, organizerId, ...restEventMock } =
        genCreateEventActionParams({
          locationId: locationSeed._id,
          categoryId: categorySeed._id,
          userId: userSeed._id,
        });

      const pathMock = `/${faker.internet.domainWord()}`;

      const createEventRes = await createEvent({
        event: { locationId, categoryId, organizerId, ...restEventMock },
        path: pathMock,
      });

      return {
        pathMock,
        locationId,
        categoryId,
        organizerId,
        restEventMock,
        createEventRes,
      };
    }

    it('should create one event with the same data as JSON', async () => {
      const { createEventRes, restEventMock } = await setupCreateEventTest();

      const allEvents = await EventModel.find();

      expect(allEvents).toHaveLength(1);
      expect(allEvents[0]).toMatchObject({ ...restEventMock });
      expect(createEventRes).toMatchObject({
        ...convertMockToJSON(restEventMock),
      });
    });

    it('should call revalidatePath() with the path arg', async () => {
      const { pathMock } = await setupCreateEventTest();

      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith(pathMock);
    });
  });

  describe('getEventById()', () => {
    it('should return event in JSON format if event exists', async () => {});
  });
});
