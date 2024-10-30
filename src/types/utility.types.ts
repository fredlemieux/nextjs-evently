// Utility type to transform Mongoose document to JSON representation
import { Types } from 'mongoose';

// Utility type for non-populated flat documents
export type ToJSON<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId
    ? string // Directly convert ObjectId to string
    : T[K] extends Date
      ? string // Convert Date to string
      : T[K] extends Array<infer U>
        ? ToJSON<U>[] // Handle arrays recursively
        : T[K] extends object
          ? ToJSON<T[K]> // Handle nested objects
          : T[K]; // For other types, retain as-is
};

export type TransformObjectIdKeys<T> = {
  [K in keyof T as K extends string
    ? T[K] extends Types.ObjectId
      ? `${K}Id`
      : K
    : K]: T[K] extends Types.ObjectId ? string : T[K];
};

export type ModelCreateParams<T> = Omit<T, '_id'>;

export type WithMongooseId<T> = T & { _id: Types.ObjectId };
