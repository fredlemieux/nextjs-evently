import { ILocation, LocationModel } from '@/lib/database/models';
import { genLocationMock } from '@test/data/location.data';

export async function seedLocation(): Promise<ILocation> {
  const locationMock = genLocationMock();
  return await LocationModel.create(locationMock);
}

export async function seedMultipleLocations(
  numberOfSeeds: number = 5
): Promise<ILocation[]> {
  return Promise.all([...Array(numberOfSeeds)].map(() => seedLocation()));
}
