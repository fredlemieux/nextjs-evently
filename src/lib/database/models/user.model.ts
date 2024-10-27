import { Schema, model, models, Model, InferSchemaType, Types } from 'mongoose';

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
});

type CreateUserParams = InferSchemaType<typeof userSchema>;

export type IUser = CreateUserParams & {
  _id: Types.ObjectId;
};

export const User: Model<IUser> =
  models.User || model<IUser>('User', userSchema);
