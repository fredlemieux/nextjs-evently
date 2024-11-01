import { CreateEventModelParams } from '@/lib/database/models';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { CreateEventActionParams } from '@/lib/actions/event.actions';
import { TransformObjectIdKeys } from '@/types/utility.types';

export function genEventMock({
  categoryId,
  locationId,
  userId,
  // idsAsString = true
}: {
  categoryId: Types.ObjectId;
  locationId: Types.ObjectId;
  userId: Types.ObjectId;
  // idsAsString: boolean
}): Omit<CreateEventModelParams, 'createdAt'> {
  return {
    category: categoryId,
    imageUrl: faker.internet.url(),
    organizer: userId,
    // createdAt: need to exclude this
    description: faker.word.words(),
    startDateTime: new Date(),
    endDateTime: faker.date.future(),
    isFree: faker.datatype.boolean(),
    location: locationId,
    price: faker.number.int({ min: 1, max: 20 }),
    title: faker.word.words(),
    url: faker.internet.url(),
  };
}

export function genCreateEventActionParams({
  categoryId,
  locationId,
  userId,
}: {
  categoryId: Types.ObjectId;
  locationId: Types.ObjectId;
  userId: Types.ObjectId;
}): Omit<TransformObjectIdKeys<CreateEventModelParams>, 'createdAt'> {
  return {
    categoryId: categoryId.toString(),
    imageUrl: faker.internet.url(),
    organizerId: userId.toString(),
    // createdAt: need to exclude this
    description: faker.word.words(),
    startDateTime: new Date(),
    endDateTime: faker.date.future(),
    isFree: faker.datatype.boolean(),
    locationId: locationId.toString(),
    price: faker.number.int({ min: 1, max: 20 }),
    title: faker.word.words(),
    url: faker.internet.url(),
  };
}
