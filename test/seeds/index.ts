import { seedLocation } from '@test/seeds/location.seed';
import { seedUser } from '@test/seeds/user.seed';
import { seedCategory } from '@test/seeds/category.seed';

export async function seedUserLocationAndCategory() {
  const locationSeed = await seedLocation();
  const userSeed = await seedUser();
  const categorySeed = await seedCategory();

  return { locationSeed, userSeed, categorySeed };
}
