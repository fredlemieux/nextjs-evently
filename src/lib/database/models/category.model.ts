import {Document, Schema, model} from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
}

const CategorySchema = new Schema({
  name: {type: String, required: true, unique: true},
});

export const Category = model<ICategory>('Category', CategorySchema);
