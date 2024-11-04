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

export async function seedEvent({
  categoryModel,
  locationModel,
  userModel,
}: {
  userModel?: IUser;
  categoryModel?: ICategory;
  locationModel?: ILocation;
} = {}): Promise<{
  userSeedModel: IUser;
  eventMock: CreateEventModelParams;
  eventSeedModel: IEvent;
  locationSeedModel: ILocation;
  categorySeedModel: ICategory;
}> {
  const userSeedModel = userModel || (await seedUser());
  const categorySeedModel = categoryModel || (await seedCategory());
  const locationSeedModel = locationModel || (await seedLocation());

  const eventMock = genEventMock({
    userId: userSeedModel._id,
    categoryId: categorySeedModel._id,
    locationId: locationSeedModel._id,
  });

  const eventSeedModel = await EventModel.create(eventMock);

  return {
    userSeedModel,
    eventMock,
    categorySeedModel,
    locationSeedModel,
    eventSeedModel,
  };
}

export async function seedEvents({
  withSameUser = false,
  withSameCategory = false,
  withSameLocation = false,
  numberOfSeeds = 6,
}: {
  withSameUser: boolean;
  withSameCategory: boolean;
  withSameLocation: boolean;
  numberOfSeeds: number;
}) {
  const userSeedModel = withSameUser ? await seedUser() : undefined;
  const categorySeedModel = withSameCategory ? await seedCategory() : undefined;
  const locationSeedModel = withSameLocation ? await seedLocation() : undefined;

  const eventPromiseArray = [...Array(numberOfSeeds)].map(() =>
    seedEvent({
      userModel: userSeedModel,
      categoryModel: categorySeedModel,
      locationModel: locationSeedModel,
    })
  );

  return await Promise.all(eventPromiseArray);
}
