import { Schema, model, models } from 'mongoose';
import { ILocation } from '@/lib/database/models/location.model';
import { ICategory } from './category.model';
import { IUser } from '@/lib/database/models/user.model';

export interface IEvent {
  title: string;
  description?: string;
  location: ILocation;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  category: ICategory;
  organizer: IUser;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  imageUrl: { type: String },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Event = models.Event || model<IEvent>('Event', eventSchema);
