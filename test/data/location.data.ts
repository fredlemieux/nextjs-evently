import { CreateLocationMongoParams } from '@/lib/database/models';
import { faker } from '@faker-js/faker';

export function genLocationMock(): CreateLocationMongoParams {
  return {
    address: faker.location.streetAddress({ useFullAddress: true }),
    googlePlaceId: faker.string.uuid(),
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    name: faker.company.name(),
    phone: faker.phone.number(),
    photos: [faker.internet.url()],
    url: faker.internet.url(),
  };
}
