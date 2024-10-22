'use server';

import { ILocation, Location } from '@/lib/database/models/location.model';
import { connectToDatabase } from '@/lib/database';
import { documentToJson, handleError } from '@/lib/utils';
import { CreateLocationParams } from '@/types/parameters.types';
import { HydratedDocument } from 'mongoose';

export async function createLocation(
  location: CreateLocationParams
): Promise<ILocation | null> {
  try {
    await connectToDatabase();

    const createdLocation: HydratedDocument<ILocation> | undefined =
      await Location.create(location);

    return documentToJson(createdLocation);
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function createLocationIfNotExists(
  locationParams: CreateLocationParams
): Promise<ILocation | null> {
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
