import { connectToDatabase } from '@/lib/database';
import { Mongoose } from 'mongoose';
import { uuidv4 } from 'mongodb-memory-server-core/lib/util/utils';

export const setupDatabaseTest = () => {
  let mongoose: Mongoose | undefined;
  beforeAll(async () => {
    const uniqueDbName = uuidv4();

    process.env.MONGODB_URI = `${process.env.MONGODB_URI_BASE}/${uniqueDbName}`;
    mongoose = await connectToDatabase();
  });

  afterEach(async () => {
    await mongoose?.connection?.db?.dropDatabase();
  });

  afterAll(async () => {
    await mongoose?.connection.close();
  });
};
