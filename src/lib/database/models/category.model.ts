import { Schema, model, models, Model, InferSchemaType, Types } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export type CreateCategoryMongoParams = InferSchemaType<typeof categorySchema>;

export type ICategory = CreateCategoryMongoParams & {
  _id: Types.ObjectId;
};

export const CategoryModel: Model<ICategory> =
  models.Category || model<ICategory>('Category', categorySchema);
