'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '@/lib/database';
import {
  Event,
  IEvent,
  Category,
  ICategory,
  User,
  IUser,
  eventSchema,
} from '@/lib/database/models';
import { handleError } from '@/lib/utils';

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types/parameters.types';
import {
  HydratedDocument,
  Query,
  RootFilterQuery,
  InferSchemaType,
} from 'mongoose';
import { ILocation } from '@/lib/database/models/location.model';
import {
  checkAndReturnObjectId,
  documentToJson,
} from '@/lib/actions/utils.actions';

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } });
};

export async function createEvent({
  userId,
  event,
  path,
}: CreateEventParams): Promise<IEvent | undefined> {
  try {
    await connectToDatabase();

    const userObjectId = checkAndReturnObjectId(userId);

    const organizer = await User.findById(userObjectId);

    if (!organizer) throw new Error('Organizer not found');

    const newEvent: HydratedDocument<IEvent> = await Event.create({
      ...event,
      category: checkAndReturnObjectId(event.categoryId),
      organizer: userObjectId,
    });

    revalidatePath(path);

    return documentToJson(newEvent);
  } catch (error) {
    handleError(error);
  }
}

export async function getEventDetailsData(
  eventId: string,
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{
  event: IEvent;
  relatedEvents?: { data?: IEvent[]; totalPages: number };
}> {
  const event = await getEventById(eventId);

  if (!event) throw new Error();

  const relatedEvents = await getRelatedEventsByCategory({
    eventId: event._id,
    categoryId: event.category._id,
    page: searchParams.page as string,
  });

  return { event, relatedEvents };
}

export async function getEventById(
  eventId: string
): Promise<IEvent | undefined> {
  try {
    await connectToDatabase();

    const eventObjectId = checkAndReturnObjectId(eventId);
    const event = await populateEventReturnJson(Event.findById(eventObjectId));

    if (!event) throw new Error('Event not found');

    return event;
  } catch (error) {
    handleError(error);
  }
}

export async function updateEvent({
  userId,
  event,
  path,
}: UpdateEventParams): Promise<IEvent | undefined> {
  try {
    await connectToDatabase();

    const eventObjectId = checkAndReturnObjectId(event._id);
    const userObjectId = checkAndReturnObjectId(userId);

    const eventToUpdate: InferSchemaType<typeof eventSchema> | null =
      await Event.findById(eventObjectId);

    if (!eventToUpdate || eventToUpdate.organizer !== userObjectId) {
      throw new Error('Unauthorized or event not found');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventObjectId,
      { ...event, category: event.categoryId },
      { new: true }
    );

    revalidatePath(path);

    return updatedEvent.toJSON();
  } catch (error) {
    handleError(error);
  }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: 'i' } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    return await queryAndReturnEvents(conditions, skipAmount, limit);
  } catch (error) {
    handleError(error);
  }
}

export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDatabase();

    const conditions = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    return await queryAndReturnEvents(conditions, skipAmount, limit);
  } catch (error) {
    handleError(error);
  }
}

export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams): Promise<
  | {
      data?: IEvent[];
      totalPages: number;
    }
  | undefined
> {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    return await queryAndReturnEvents(conditions, skipAmount, limit);
  } catch (error) {
    handleError(error);
  }
}

async function queryAndReturnEvents(
  conditions: RootFilterQuery<IEvent>,
  skipAmount: number,
  limit: number
): Promise<{ data?: IEvent[]; totalPages: number }> {
  const eventsQuery = Event.find(conditions)
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit);

  const events = await populateEventsReturnJson(eventsQuery);

  const eventsCount = await Event.countDocuments(conditions);

  return {
    data: events ? events : undefined,
    totalPages: Math.ceil(eventsCount / limit),
  };
}

// TODO! Use overloading and remove duplicate
function populateEventReturnJson(
  query: Query<IEvent | null, IEvent>
): Promise<IEvent | null> {
  return query
    .populate<IUser>({
      path: 'organizer',
      model: User,
      select: '_id firstName lastName',
    })
    .populate<ICategory>({
      path: 'category',
      model: Category,
      select: '_id name',
    })
    .populate<ILocation>('location')
    .lean<IEvent>()
    .exec();
}

function populateEventsReturnJson(
  query: Query<IEvent[] | null, IEvent>
): Promise<IEvent[] | null> {
  return query
    .populate<IUser>({
      path: 'organizer',
      model: User,
      select: '_id firstName lastName',
    })
    .populate<ICategory>({
      path: 'category',
      model: Category,
      select: '_id name',
    })
    .populate<ILocation>('location')
    .lean<IEvent[]>()
    .exec();
}
