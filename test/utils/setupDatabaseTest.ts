import { connectToDatabase } from '@/lib/database';
import { Mongoose } from 'mongoose';

export const setupDatabaseTest = () => {
  let mongoose: Mongoose | undefined;

  beforeAll(async () => {
    mongoose = await connectToDatabase();
  });

  afterEach(async () => {
    await mongoose?.connection?.db?.dropDatabase();
  });

  afterAll(async () => {
    await mongoose?.connection.close();
  });
};
