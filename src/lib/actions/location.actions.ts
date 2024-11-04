'use server';

import { connectToDatabase } from '@/lib/database';
import { handleError } from '@/lib/utils';
import { documentToJSON } from '@/lib/utils/mongoose.utils';
import {
  ILocation,
  LocationModel,
  CreateLocationMongoParams,
} from '@/lib/database/models/location.model';

import type { ToJSON } from '@/types/utility.types';

export async function createLocation(
  location: CreateLocationMongoParams
): Promise<ToJSON<ILocation> | undefined> {
  try {
    await connectToDatabase();

    const createdLocation = await LocationModel.create(location);

    return documentToJSON(createdLocation);
  } catch (error) {
    handleError(error);
  }
}

export async function createLocationIfNotExists(
  locationParams: CreateLocationMongoParams
): Promise<ToJSON<ILocation> | undefined> {
  const location = await findLocationByGooglePlaceId(
    locationParams.googlePlaceId
  );

  if (location) return location;

  return await createLocation(locationParams);
}

async function findLocationByGooglePlaceId(
  googlePlaceId: string
): Promise<ToJSON<ILocation> | null> {
  await connectToDatabase();

  const location = await LocationModel.findOne({
    googlePlaceId,
  });

  return documentToJSON(location);
}
