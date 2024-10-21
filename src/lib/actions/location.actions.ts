import { Venue } from '@/lib/database/models/venue.model';
import { connectToDatabase } from '@/lib/database';
import { handleError } from '@/lib/utils';
import { CreateLocationParams } from '@/types/parameters.types';

export async function addLocation(venue: CreateLocationParams) {
  try {
    await connectToDatabase();

    const newVenue = await Venue.create(venue);

    return newVenue.toJSON();
  } catch (error) {
    handleError(error);
  }
}
