import { HydratedDocument, Types } from 'mongoose';

export function documentToJson<T>(document: HydratedDocument<T>): T;
export function documentToJson<T>(document: HydratedDocument<T>[]): T[];
export function documentToJson<T>(
  document: HydratedDocument<T> | HydratedDocument<T>[]
): T | T[] {
  if (Array.isArray(document)) {
    return document.map((doc) => JSON.parse(JSON.stringify(doc)));
  } else {
    return JSON.parse(JSON.stringify(document));
  }
}

export function checkAndReturnObjectId(
  id: Types.ObjectId | string
): Types.ObjectId {
  return typeof id === 'string' ? new Types.ObjectId(id) : id;
}
