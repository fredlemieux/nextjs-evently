import { Schema, model, models, InferSchemaType, Types } from 'mongoose';
import { ILocation } from '@/lib/database/models/location.model';
import { ICategory } from './category.model';
import { IUser } from '@/lib/database/models/user.model';

export const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: false },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  imageUrl: { type: String, default: '' },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  price: { type: String, default: '' },
  isFree: { type: Boolean, default: false },
  url: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Create a compound index to enforce uniqueness
eventSchema.index(
  { startDateTime: 1, location: 1, name: 1, endDateTime: 1 },
  { unique: true }
);

eventSchema.index({ startDateTime: 1, category: 1 });

eventSchema.index({ category: 1 });

export type CreateEventModelParams = InferSchemaType<typeof eventSchema>;

export type IEvent = CreateEventModelParams & {
  _id: Types.ObjectId;
};

export interface IEventPopulated
  extends Omit<IEvent, 'location' | 'category' | 'createdBy'> {
  location: ILocation;
  category: ICategory;
  createdBy: IUser;
}

export const EventModel = models.Event || model<IEvent>('Event', eventSchema);
