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

export async function createLocationFromPlace(
  placeResult: google.maps.places.PlaceResult
) {
  const createLocationParams = getLocationParamsFromPlace(placeResult);

  return await createLocationIfNotExists(createLocationParams);
}

function getLocationParamsFromPlace({
  place_id,
  name,
  formatted_address,
  geometry,
  international_phone_number,
  photos,
  url,
}: google.maps.places.PlaceResult): CreateLocationParams {
  if (
    !place_id ||
    !name ||
    !formatted_address ||
    !geometry ||
    !geometry.location?.lat() ||
    !geometry.location?.lng() ||
    !international_phone_number ||
    !photos ||
    !url
  ) {
    throw new Error('Missing Params!!');
  }

  return {
    name,
    address: formatted_address,
    lat: geometry?.location?.lat(),
    lng: geometry?.location?.lng(),
    googlePlaceId: place_id,
    phone: international_phone_number,
    photos: photos.map((photo) => photo.getUrl()),
    url,
  };
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
