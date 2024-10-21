import { Schema, model, models, Model } from 'mongoose';

export interface ILocation {
  googlePlaceId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  url: string;
  phone: string;
  photos: string[];
}

const locationSchema = new Schema<ILocation>({
  googlePlaceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: false },
  lng: { type: Number, required: false },
  url: { type: String, required: false },
  phone: { type: String, required: false },
  photos: { type: [String], required: false },
});

locationSchema.index({ googlePlaceId: 1 });

export const Location: Model<ILocation> =
  models.Venue || model<ILocation>('Location', locationSchema);
