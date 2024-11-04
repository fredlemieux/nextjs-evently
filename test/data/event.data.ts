import { CreateEventModelParams } from '@/lib/database/models';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { CreateEventParams } from '@/lib/actions/event.actions';

export function genEventMock({
  categoryId,
  locationId,
  userId,
  // idsAsString = true
}: {
  categoryId: Types.ObjectId;
  locationId: Types.ObjectId;
  userId: Types.ObjectId;
}): CreateEventModelParams {
  return {
    category: categoryId,
    imageUrl: faker.internet.url(),
    organizer: userId,
    description: faker.word.words(),
    startDateTime: new Date(),
    endDateTime: faker.date.future(),
    isFree: faker.datatype.boolean(),
    location: locationId,
    price: String(faker.number.int({ min: 1, max: 20 })),
    title: faker.word.words(),
    url: faker.internet.url(),
  };
}

export function genCreateEventActionParams({
  userId = new Types.ObjectId(),
  categoryId = new Types.ObjectId(),
  locationId = new Types.ObjectId(),
}: {
  userId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  locationId?: Types.ObjectId;
} = {}): CreateEventParams {
  return {
    locationId: locationId.toString(),
    organizerId: userId.toString(),
    categoryId: categoryId.toString(),
    imageUrl: faker.internet.url(),
    description: faker.word.words(),
    startDateTime: new Date(),
    endDateTime: faker.date.future(),
    isFree: faker.datatype.boolean(),
    price: faker.number.int({ min: 1, max: 20 }),
    title: faker.word.words(),
    url: faker.internet.url(),
  };
}
