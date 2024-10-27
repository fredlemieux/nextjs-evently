import { Schema, model, models, Model, InferSchemaType, Types } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export type CreateCategoryParams = InferSchemaType<typeof categorySchema>;

export type ICategory = CreateCategoryParams & {
  _id: Types.ObjectId;
};

export const Category: Model<ICategory> =
  models.Category || model<ICategory>('Category', categorySchema);
