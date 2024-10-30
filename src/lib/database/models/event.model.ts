import { Schema, model, models, InferSchemaType, Types } from 'mongoose';
import { ILocation } from '@/lib/database/models/location.model';
import { ICategory } from './category.model';
import { IUser } from '@/lib/database/models/user.model';

export const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  imageUrl: { type: String, default: '' },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String, default: '' },
  isFree: { type: Boolean, default: false },
  url: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export type CreateEventParams = InferSchemaType<typeof eventSchema>;

export type IEvent = CreateEventParams & {
  _id: Types.ObjectId;
};

export interface IEventPopulated
  extends Omit<IEvent, 'location' | 'category' | 'organizer'> {
  location: ILocation;
  category: ICategory;
  organizer: IUser;
}

export const EventModel = models.Event || model<IEvent>('Event', eventSchema);
