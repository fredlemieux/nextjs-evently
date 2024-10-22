import { Schema, model, models, Model } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
}

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Category: Model<ICategory> =
  models.Category || model<ICategory>('Category', categorySchema);
