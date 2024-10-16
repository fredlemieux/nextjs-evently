import {Document, Schema, model, Types} from 'mongoose';
import {IUser} from "./user.model";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  category: { _id: Types.ObjectId; name: string };
  organizer: IUser['_id'];
}

const EventSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  location: {type: String},
  createdAt: {type: Date, default: Date.now},
  imageUrl: {type: String},
  startDateTime: {type: Date, default: Date.now},
  endDateTime: {type: Date, default: Date.now},
  price: {type: String},
  isFree: {type: Boolean, default: false},
  url: {type: String},
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  organizer: {type: Schema.Types.ObjectId, ref: 'User'},
});

export const Event = model<IEvent>('Event', EventSchema);
