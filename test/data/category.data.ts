import { CreateCategoryMongoParams } from '@/lib/database/models';
import { faker } from '@faker-js/faker';

export function genCategoryMock(): CreateCategoryMongoParams {
  return {
    name: faker.word.adjective(),
  };
}
