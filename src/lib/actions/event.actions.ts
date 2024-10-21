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
import { Query, RootFilterQuery } from 'mongoose';
import { ILocation } from '@/lib/database/models/location.model';
// import { createLocation } from '@/lib/actions/location.actions';

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } });
};

function populateEvent(query: Query<IEvent | null, IEvent>) {
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
    .populate<ILocation>('location');
}

function populateEvents(query: Query<IEvent[] | null, IEvent>) {
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
    .populate<ILocation>('location');
}

export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);

    if (!organizer) throw new Error('Organizer not found');

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));

    if (!event) throw new Error('Event not found');

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// export async function updateEvent({ userId, event, path }: UpdateEventParams) {
export async function updateEvent({ event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);
    // if (!eventToUpdate || eventToUpdate.organizer !== userId) {
    if (!eventToUpdate) {
      throw new Error('Unauthorized or event not found');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );

    revalidatePath(path);

    if (updatedEvent) {
      return updatedEvent.toJSON();
    }
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
}: GetRelatedEventsByCategoryParams) {
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
) {
  const eventsQuery = Event.find(conditions)
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit);

  const events = await populateEvents(eventsQuery);
  const eventsCount = await Event.countDocuments(conditions);

  return {
    data: JSON.parse(JSON.stringify(events)),
    totalPages: Math.ceil(eventsCount / limit),
  };
}
