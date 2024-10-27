import { Types } from 'mongoose';
import { RecursiveToJSON, ToJSON } from '@/types/utility.types';

export function documentToJson<T>(document: T): ToJSON<T>;
export function documentToJson<T>(document: T[]): ToJSON<T>[];
export function documentToJson<T>(document: T): RecursiveToJSON<T>;
export function documentToJson<T>(document: T[]): RecursiveToJSON<T>[];
export function documentToJson<T>(
  document: T | T[]
): ToJSON<T> | RecursiveToJSON<T> | ToJSON<T>[] | RecursiveToJSON<T>[] {
  if (Array.isArray(document)) {
    return document.map((doc) =>
      JSON.parse(JSON.stringify(doc))
    ) as ToJSON<T>[];
  } else {
    return JSON.parse(JSON.stringify(document)) as ToJSON<T>;
  }
}
export function documentToJson<T>(document: T): ToJSON<T>;
export function documentToJson<T>(document: T[]): ToJSON<T>[];
export function documentToJson<T>(document: T): RecursiveToJSON<T>;
export function documentToJson<T>(document: T[]): RecursiveToJSON<T>[];
export function documentToJson<T>(
  document: T | T[]
): ToJSON<T> | RecursiveToJSON<T> | ToJSON<T>[] | RecursiveToJSON<T>[] {
  if (Array.isArray(document)) {
    return document.map((doc) =>
      JSON.parse(JSON.stringify(doc))
    ) as ToJSON<T>[];
  } else {
    return JSON.parse(JSON.stringify(document)) as ToJSON<T>;
  }
}

export function checkAndReturnObjectId(
  id: Types.ObjectId | string
): Types.ObjectId {
  return typeof id === 'string' ? new Types.ObjectId(id) : id;
}
