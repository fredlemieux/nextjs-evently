'use server';

import { Location } from '@/lib/database/models/location.model';
import { connectToDatabase } from '@/lib/database';
import { handleError } from '@/lib/utils';
import { CreateLocationParams } from '@/types/parameters.types';

export async function createLocation(location: CreateLocationParams) {
  try {
    await connectToDatabase();

    return await Location.create(location);
  } catch (error) {
    handleError(error);
  }
}

export async function createLocationIfNotExists(
  locationParams: CreateLocationParams
) {
  const location = await findLocationByGooglePlaceId(
    locationParams.googlePlaceId
  );

  if (location) return location;

  return await createLocation(locationParams);
}

export async function findLocationByGooglePlaceId(googlePlaceId: string) {
  await connectToDatabase();

  return Location.findOne({ googlePlaceId });
}
