import {
  CreateEventModelParams,
  EventModel,
  ICategory,
  IEvent,
  ILocation,
  IUser,
} from '@/lib/database/models';
import { seedUser } from '@test/seeds/user.seed';
import { seedCategory } from '@test/seeds/category.seed';
import { seedLocation } from '@test/seeds/location.seed';
import { genEventMock } from '@test/data/event.data';

export async function seedEvent(): Promise<{
  eventMock: CreateEventModelParams;
  eventSeedModel: IEvent;
  userSeedModel: IUser;
  locationSeedModel: ILocation;
  categorySeedModel: ICategory;
}> {
  const userSeedModel = await seedUser();
  const categorySeedModel = await seedCategory();
  const locationSeedModel = await seedLocation();

  const eventMock = genEventMock({
    userId: userSeedModel._id,
    categoryId: categorySeedModel._id,
    locationId: locationSeedModel._id,
  });

  const eventSeedModel = await EventModel.create(eventMock);

  return {
    eventMock,
    userSeedModel,
    categorySeedModel,
    locationSeedModel,
    eventSeedModel,
  };
}
