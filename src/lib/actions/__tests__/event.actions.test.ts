import { seedUserLocationAndCategory } from '@test/seeds';
import { genCreateEventActionParams } from '@test/data/event.data';
import {
  createEvent,
  deleteEvent,
  getEventById,
  updateEvent,
} from '@/lib/actions/event.actions';
import { faker } from '@faker-js/faker';
import {
  EventModel,
  IEvent,
  LocationModel,
  UserModel,
} from '@/lib/database/models';
import { revalidatePath } from 'next/cache';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { seedEvent } from '@test/seeds/event.seed';
import { Types } from 'mongoose';
import { documentToJSON } from '@/lib/utils/mongoose.utils';
import { seedUser } from '@test/seeds/user.seed';
import { auth } from '@clerk/nextjs/server';
import { genClerkJwtAuth } from '@test/data/clerk.data';

jest.mock('next/cache');
// https://stackoverflow.com/questions/48759035/mock-dependency-in-jest-with-typescript
const revalidatePathMock = <jest.Mock<typeof revalidatePath>>revalidatePath;

// jest.MockedFunction<typeof auth> causes problems as we'd have to mock the Auth object which isn't exported
const authMock = auth as unknown as jest.Mock;
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

describe('Event Actions', () => {
  setupDatabaseTest();

  beforeEach(() => {
    revalidatePathMock.mockReset();
  });

  describe('createEvent()', () => {
    async function setupCreateEventTest() {
      const { locationSeed, categorySeed, userSeed } =
        await seedUserLocationAndCategory();

      const { locationId, categoryId, createdById, ...restEventMock } =
        genCreateEventActionParams({
          locationId: locationSeed._id,
          categoryId: categorySeed._id,
          userId: userSeed._id,
        });

      const pathMock = `/${faker.internet.domainWord()}`;

      const createEventRes = await createEvent({
        event: { locationId, categoryId, createdById, ...restEventMock },
        path: pathMock,
      });

      return {
        pathMock,
        locationId,
        categoryId,
        createdById,
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

  describe('deleteEvent()', () => {
    it('should delete the event if it exists', async () => {
      const { eventSeedModel } = await seedEvent();
      // Second event to test it doesn't delete others;
      await seedEvent();

      const allEventsBeforeDelete = await EventModel.find();
      await deleteEvent({
        eventId: eventSeedModel._id.toString(),
        path: '/any',
      });
      const allEventsAfterDelete = await EventModel.find();

      expect(allEventsBeforeDelete).toHaveLength(2);
      expect(allEventsAfterDelete).toHaveLength(1);
    });

    it('should call revalidate with path arg provided', async () => {
      const { eventSeedModel } = await seedEvent();
      const pathMock = `/${faker.internet.domainWord()}`;

      await deleteEvent({
        eventId: eventSeedModel._id.toString(),
        path: pathMock,
      });

      expect(revalidatePathMock).toBeCalledTimes(1);
      expect(revalidatePathMock).toBeCalledWith(pathMock);
    });
  });

  describe('getEventById()', () => {
    describe('Field Populations', () => {
      it('should return populated location field', async () => {
        const { eventSeedModel, locationSeedModel } = await seedEvent();
        const locationJSON = documentToJSON(locationSeedModel);

        const getEventByIdRes = await getEventById(
          eventSeedModel._id.toString()
        );

        expect(getEventByIdRes?.location).toMatchObject(locationJSON);
        expect(getEventByIdRes).not.toBeInstanceOf(LocationModel);
      });

      it('should return populated createdBy field', async () => {
        const { eventSeedModel, userSeedModel } = await seedEvent();
        const userJSON = documentToJSON(userSeedModel);

        const getEventByIdRes = await getEventById(
          eventSeedModel._id.toString()
        );

        if (!getEventByIdRes) {
          throw new Error('No Event Returned');
        }

        expect(userJSON).toMatchObject(getEventByIdRes?.createdBy);
        expect(getEventByIdRes?.createdBy);
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
        expect(getEventByIdRes.createdBy).not.toBeInstanceOf(UserModel);
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
        const { createdBy, location, category, ...restEventRes } =
          getEventByIdRes;

        expect(eventSeedJSON).toMatchObject(restEventRes);
        expect(getEventByIdRes).not.toBeInstanceOf(EventModel);
      });
    });

    describe('Error Handling', () => {
      it.skip('should throw an error if event does not exist', async () => {
        // TODO! we should think how we handle errors correctly
        const mockId = new Types.ObjectId().toString();

        await expect(getEventById(mockId)).rejects.toThrow(
          'Error: Event not found'
        );
      });
    });

    describe('updateEvent()', () => {
      async function setupUpdateEventTest() {
        const { userSeedModel, eventSeedModel } = await seedEvent();
        const createEventParamsMock = genCreateEventActionParams({
          userId: userSeedModel._id,
        });

        const originalEventData = await EventModel.find({});

        const updateEventParamsMock = {
          _id: eventSeedModel._id.toString(),
          ...createEventParamsMock,
        };
        return {
          userSeedModel,
          eventSeedModel,
          originalEventData,
          updateEventParamsMock,
        };
      }

      it('should update event with new data', async () => {
        const {
          userSeedModel,
          eventSeedModel,
          originalEventData,
          updateEventParamsMock,
        } = await setupUpdateEventTest();

        await updateEvent({
          userId: userSeedModel._id.toString(),
          event: updateEventParamsMock,
          path: '/any',
        });

        const {
          createdById,
          locationId: updatedLocationId,
          categoryId: updateCategoryId,
          ...restUpdateEventParams
        } = updateEventParamsMock;

        const updatedEventData: IEvent[] = await EventModel.find({});
        const updatedEventDataJSON = documentToJSON(updatedEventData);

        // Assert the original data is correct
        expect(originalEventData).toHaveLength(1);
        expect(documentToJSON(originalEventData[0])).toEqual(
          documentToJSON(eventSeedModel)
        );
        // Assert the updated data is correct
        expect(updatedEventData).toHaveLength(1);
        expect(updatedEventDataJSON[0]).toMatchObject(
          documentToJSON(restUpdateEventParams)
        );
        expect(updatedEventDataJSON[0].location).toEqual(updatedLocationId);
        expect(updatedEventDataJSON[0].category).toEqual(updateCategoryId);
        expect(updatedEventDataJSON[0].createdBy).toEqual(createdById);
      });

      it('should should call revalidatePath with correct path', async () => {
        const { userSeedModel, updateEventParamsMock } =
          await setupUpdateEventTest();

        const pathMock = `/${faker.internet.domainWord()}`;

        await updateEvent({
          userId: userSeedModel._id.toString(),
          event: updateEventParamsMock,
          path: pathMock,
        });

        expect(revalidatePath).toHaveBeenCalledTimes(1);
        expect(revalidatePath).toHaveBeenCalledWith(pathMock);
      });

      describe('Handle Errors', () => {
        it('should throw an error if the USER is not found', async () => {
          const mockCreateEventParams = genCreateEventActionParams();
          const mockUserId = new Types.ObjectId();

          await expect(
            updateEvent({
              userId: mockUserId.toString(),
              event: {
                ...mockCreateEventParams,
                _id: new Types.ObjectId().toString(),
              },
              path: '/any',
            })
          ).rejects.toThrow();
        });

        it('should throw an error if the EVENT is not found', async () => {
          const { _id: userId } = await seedUser();

          const mockCreateEventParams = genCreateEventActionParams({
            userId,
          });
          const mockUserId = new Types.ObjectId();

          await expect(
            updateEvent({
              userId: mockUserId.toString(),
              event: {
                ...mockCreateEventParams,
                _id: new Types.ObjectId().toString(),
              },
              path: '/any',
            })
          ).rejects.toThrow();
        });
      });
    });
  });
});
