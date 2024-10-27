// Utility type to transform Mongoose document to JSON representation
import { Types } from 'mongoose';

type ReplaceObjectId<T> = T extends Types.ObjectId ? string : T;
type ReplaceObjectIdInArray<T> =
  T extends Array<infer U> ? Array<ReplaceObjectId<U>> : T;

export type FlatToJSON<T> = {
  [K in keyof T]: ReplaceObjectIdInArray<ReplaceObjectId<T[K]>>;
};

// // Utility type to apply FlatToJSON recursively on nested objects
export type ToJSON<T> = T extends object
  ? T extends Types.ObjectId
    ? string
    : T extends (infer U)[]
      ? ToJSON<U>[]
      : {
          [K in keyof T]: ToJSON<T[K]>;
        }
  : T;
// export type ToJSON<T> = {
//   [K in keyof T]: T[K] extends Document
//     ? ToJSON<T[K]>
//     : T[K] extends Types.ObjectId
//       ? string
//       : T[K];
// };
export type ModelCreateParams<T> = Omit<T, '_id'>;

export type WithMongooseId<T> = T & { _id: Types.ObjectId };
