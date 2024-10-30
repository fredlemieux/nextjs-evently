import { ILocation, LocationModel } from '@/lib/database/models';
import { genLocationMock } from '@test/data/location.data';

export async function locationSeed(): Promise<ILocation> {
  const locationMock = genLocationMock();
  return await LocationModel.create(locationMock);
}
