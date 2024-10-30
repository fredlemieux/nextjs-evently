import { CreateEventModelParams } from '@/lib/database/models';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

export function generateEventData({
  categoryId,
  locationId,
  userId,
}: {
  categoryId: Types.ObjectId;
  locationId: Types.ObjectId;
  userId: Types.ObjectId;
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
