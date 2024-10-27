import mongoose, { set } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const cached = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  if (process.env.MONGO_DEBUG) {
    set('debug', true);
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: 'eventos-rincon',
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.mongoose = cached;

  return cached.conn;
};
