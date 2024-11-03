import { seedUserLocationAndCategory } from '@test/seeds';
import { genCreateEventActionParams } from '@test/data/event.data';
import { createEvent, getEventById } from '@/lib/actions/event.actions';
import { faker } from '@faker-js/faker';
import { EventModel, LocationModel, UserModel } from '@/lib/database/models';
import { revalidatePath } from 'next/cache';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { seedEvent } from '@test/seeds/event.seed';
import { Types } from 'mongoose';
import { documentToJSON } from '@/lib/utils/mongoose.utils';

jest.mock('next/cache');
// https://stackoverflow.com/questions/48759035/mock-dependency-in-jest-with-typescript
const revalidatePathMock = <jest.Mock<typeof revalidatePath>>revalidatePath;

describe('Event Actions', () => {
  setupDatabaseTest();

  beforeEach(() => {
    revalidatePathMock.mockReset();
  });

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
        ...documentToJSON(restEventMock),
      });
    });

    it('should call revalidatePath() with the path arg', async () => {
      const { pathMock } = await setupCreateEventTest();

      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith(pathMock);
    });
  });

  describe('getEventById()', () => {
    describe('returns populated event', () => {
      it('should return populated location field', async () => {
        const { eventSeedModel, locationSeedModel } = await seedEvent();
        const locationJSON = documentToJSON(locationSeedModel);

        const getEventByIdRes = await getEventById(
          eventSeedModel._id.toString()
        );

        expect(getEventByIdRes?.location).toMatchObject(locationJSON);
        expect(getEventByIdRes).not.toBeInstanceOf(LocationModel);
      });

      it('should return populated organizer field', async () => {
        const { eventSeedModel, userSeedModel } = await seedEvent();
        const userJSON = documentToJSON(userSeedModel);

        const getEventByIdRes = await getEventById(
          eventSeedModel._id.toString()
        );

        if (!getEventByIdRes) {
          throw new Error('No Event Returned');
        }

        expect(userJSON).toMatchObject(getEventByIdRes?.organizer);
        expect(getEventByIdRes?.organizer);
        expect(getEventByIdRes).not.toBeInstanceOf(UserModel);
      });

      it('should return populated category field', async () => {
        const { eventSeedModel, categorySeedModel } = await seedEvent();
        const categoryJSON = documentToJSON(categorySeedModel);

        const getEventByIdRes = await getEventById(
          eventSeedModel._id.toString()
        );

        if (!getEventByIdRes) {
          throw new Error('No Event Returned');
        }

        expect(categoryJSON).toMatchObject(getEventByIdRes?.category);
        expect(getEventByIdRes.organizer).not.toBeInstanceOf(UserModel);
      });

      it('unpopulated fields should remain', async () => {
        const { eventSeedModel } = await seedEvent();
        const eventSeedJSON = documentToJSON(eventSeedModel);

        const getEventByIdRes = await getEventById(
          eventSeedModel._id.toString()
        );

        if (!getEventByIdRes) {
          throw new Error('No Event Returned');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organizer, location, category, ...restEventRes } =
          getEventByIdRes;

        expect(eventSeedJSON).toMatchObject(restEventRes);
        expect(getEventByIdRes).not.toBeInstanceOf(EventModel);
      });
    });

    it('should throw an error if event does not exist', async () => {
      const mockId = new Types.ObjectId().toString();

      await expect(getEventById(mockId)).rejects.toThrow();
    });
  });
});
