'use server';

import { ILocation, Location } from '@/lib/database/models/location.model';
import { connectToDatabase } from '@/lib/database';
import { documentToJson, handleError } from '@/lib/utils';
import { CreateLocationParams } from '@/types/parameters.types';
import { HydratedDocument } from 'mongoose';

export async function createLocation(
  location: CreateLocationParams
): Promise<ILocation | undefined> {
  try {
    await connectToDatabase();

    const createdLocation: HydratedDocument<ILocation> | undefined =
      await Location.create(location);

    return documentToJson(createdLocation);
  } catch (error) {
    handleError(error);
  }
}

export async function createLocationIfNotExists(
  locationParams: CreateLocationParams
): Promise<ILocation | undefined> {
  const location = await findLocationByGooglePlaceId(
    locationParams.googlePlaceId
  );

  if (location) return location;

  return await createLocation(locationParams);
}

export async function findLocationByGooglePlaceId(
  googlePlaceId: string
): Promise<ILocation | null> {
  await connectToDatabase();

  return Location.findOne({ googlePlaceId }).lean();
}
