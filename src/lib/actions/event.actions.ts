'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/database';
import {
  Event,
  IEvent,
  Category,
  User,
  Location,
  IEventPopulated,
} from '@/lib/database/models';
import { handleError } from '@/lib/utils';
import {
  checkAndReturnObjectId,
  documentToJson,
} from '@/lib/utils/mongoose.utils';

import type {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types/parameters.types';
import type { RecursiveToJSON, ToJSON } from '@/types/utility.types';
import type { Query, RootFilterQuery } from 'mongoose';

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } });
};

export async function createEvent({
  userId,
  event,
  path,
}: CreateEventParams): Promise<ToJSON<IEvent> | undefined> {
  try {
    await connectToDatabase();

    const userObjectId = checkAndReturnObjectId(userId);

    const organizer = await User.findById(userObjectId);

    if (!organizer) throw new Error('Organizer not found');

    const newEvent: IEvent = await Event.create({
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
  event: RecursiveToJSON<IEventPopulated>;
  relatedEvents?: {
    data?: RecursiveToJSON<IEventPopulated>[];
    totalPages: number;
  };
}> {
  const event = await getEventById(eventId);

  if (!event) throw new Error();

  const relatedEvents = await getRelatedEventsByCategory({
    eventId: event._id,
    categoryId: event.category._id,
    page: searchParams.page as string, // TODO! Type properly
  });

  return { event, relatedEvents };
}

export async function getEventById(
  eventId: string
): Promise<RecursiveToJSON<IEventPopulated> | undefined> {
  try {
    await connectToDatabase();

    const eventObjectId = checkAndReturnObjectId(eventId);

    const query = Event.findById(eventObjectId);
    const event = await populateEvents(query);

    if (!event) throw new Error('Event not found');

    return documentToJson(event);
  } catch (error) {
    handleError(error);
  }
}

export async function updateEvent({
  userId,
  event,
  path,
}: UpdateEventParams): Promise<ToJSON<IEvent> | undefined> {
  try {
    await connectToDatabase();

    const eventObjectId = checkAndReturnObjectId(event._id);
    const userObjectId = checkAndReturnObjectId(userId);

    const eventToUpdate = await Event.findById(eventObjectId);

    if (!eventToUpdate || eventToUpdate.organizer !== userObjectId) {
      throw new Error('Unauthorized or event not found');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventObjectId,
      { ...event, category: event.categoryId },
      { new: true }
    );

    revalidatePath(path);

    return documentToJson<IEvent>(updatedEvent);
  } catch (error) {
    handleError(error);
  }
}

export async function deleteEvent({
  eventId,
  path,
}: DeleteEventParams): Promise<void> {
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
      data?: RecursiveToJSON<IEventPopulated>[];
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
): Promise<{ data?: RecursiveToJSON<IEventPopulated>[]; totalPages: number }> {
  const eventsQuery = Event.find(conditions)
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit);

  const events = await populateEvents(eventsQuery);

  const eventsCount = await Event.countDocuments(conditions);

  return {
    data: events ? documentToJson(events) : undefined,
    totalPages: Math.ceil(eventsCount / limit),
  };
}

function populateEvents(
  query: Query<IEvent | null, IEvent>
): Promise<IEventPopulated | null>;
function populateEvents(
  query: Query<IEvent[] | null, IEvent>
): Promise<IEventPopulated[] | null>;
function populateEvents(
  query: Query<IEvent | null, IEvent> | Query<IEvent[] | null, IEvent>
): Promise<IEventPopulated | null | IEventPopulated[]> {
  return query
    .populate({
      path: 'organizer',
      model: User,
      select: '_id firstName lastName',
    })
    .populate({
      path: 'category',
      model: Category,
      select: '_id name',
    })
    .populate({ path: 'location', model: Location })
    .lean<IEventPopulated>()
    .exec();
}
