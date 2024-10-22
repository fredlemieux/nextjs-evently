'use server';

import { ILocation, Location } from '@/lib/database/models/location.model';
import { connectToDatabase } from '@/lib/database';
import { handleError } from '@/lib/utils';
import { CreateLocationParams } from '@/types/parameters.types';
import { HydratedDocument } from 'mongoose';
import { documentToJson } from '@/lib/actions/utils.actions';

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

  const location = await Location.findOne({
    googlePlaceId,
  });

  return JSON.parse(JSON.stringify(location));
}
