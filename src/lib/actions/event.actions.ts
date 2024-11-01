'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/database';
import {
  EventModel,
  IEvent,
  CategoryModel,
  UserModel,
  LocationModel,
  IEventPopulated,
  CreateEventModelParams,
} from '@/lib/database/models';
import { handleError } from '@/lib/utils';
import {
  checkAndReturnObjectId,
  documentToJson,
} from '@/lib/utils/mongoose.utils';

import {
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types/parameters.types';
import { ToJSON, TransformObjectIdKeys } from '@/types/utility.types';
import type { Query, RootFilterQuery } from 'mongoose';
import { getCategoryByName } from '@/lib/actions/category.actions';

export type CreateEventActionParams = {
  event: Omit<TransformObjectIdKeys<CreateEventModelParams>, 'createAt'>;
  path: string;
};

export async function createEvent({
  event,
  path,
}: CreateEventActionParams): Promise<ToJSON<IEvent> | undefined> {
  try {
    await connectToDatabase();

    const { organizerId, categoryId, locationId, ...restEvent } = event;

    if (!organizerId || !categoryId || !locationId) {
      throw new Error('organizerId, categoryId and locationId are required!');
    }

    const organizerObjectId = checkAndReturnObjectId(organizerId);
    const categoryObjectId = checkAndReturnObjectId(categoryId);
    const locationObjectId = checkAndReturnObjectId(locationId);

    const organizer = await UserModel.findById(organizerObjectId);

    if (!organizer) throw new Error('Organizer not found');

    const createEventParams: CreateEventModelParams = {
      ...restEvent,
      category: categoryObjectId,
      organizer: organizerObjectId,
      location: locationObjectId,
    };

    const newEvent: IEvent = await EventModel.create(createEventParams);

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
  event: ToJSON<IEventPopulated>;
  relatedEvents?: {
    data?: ToJSON<IEventPopulated>[];
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
): Promise<ToJSON<IEventPopulated> | undefined> {
  try {
    await connectToDatabase();

    const eventObjectId = checkAndReturnObjectId(eventId);

    const query = EventModel.findById(eventObjectId);
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

    const eventToUpdate = await EventModel.findById(eventObjectId);

    if (!eventToUpdate || eventToUpdate.organizer !== userObjectId) {
      throw new Error('Unauthorized or event not found');
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
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

    const deletedEvent = await EventModel.findByIdAndDelete(eventId);
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
      data?: ToJSON<IEventPopulated>[];
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
): Promise<{ data?: ToJSON<IEventPopulated>[]; totalPages: number }> {
  const eventsQuery = EventModel.find(conditions)
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit);

  const events = await populateEvents(eventsQuery);

  const eventsCount = await EventModel.countDocuments(conditions);

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
      model: UserModel,
      select: '_id firstName lastName',
    })
    .populate({
      path: 'category',
      model: CategoryModel,
      select: '_id name',
    })
    .populate({ path: 'location', model: LocationModel })
    .lean<IEventPopulated>()
    .exec();
}
