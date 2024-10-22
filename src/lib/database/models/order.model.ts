import { Schema, model, models, Model } from 'mongoose';
import { IEvent } from '@/lib/database/models/event.model';
import { IUser } from '@/lib/database/models/user.model';

export interface IOrder {
  _id: string;
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: IEvent;
  buyer: IUser;
}

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  event: string;
  buyer: string;
};

const orderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const Order: Model<IOrder> =
  models.Order || model<IOrder>('Order', orderSchema);
