// Utility type to transform Mongoose document to JSON representation
import { Types } from 'mongoose';

type ConvertObjectId<T> = T extends Types.ObjectId ? string : T;

type ConvertDate<T> = T extends Date ? string : T;

// Utility type for non-populated documents
export type ToJSON<T> = {
  [K in keyof T]: ConvertObjectId<ConvertDate<T>>;
};

export type RecursiveToJSON<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId
    ? string // Directly convert ObjectId to string
    : T[K] extends Date
      ? string // Convert Date to string
      : T[K] extends Array<infer U>
        ? RecursiveToJSON<U>[] // Handle arrays recursively
        : T[K] extends object
          ? RecursiveToJSON<T[K]> // Handle nested objects
          : T[K]; // For other types, retain as-is
};
export type ModelCreateParams<T> = Omit<T, '_id'>;

export type WithMongooseId<T> = T & { _id: Types.ObjectId };
