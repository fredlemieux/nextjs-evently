import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { config } from './utils/config';
import { uuidv4 } from 'mongodb-memory-server-core/lib/util/utils';

export default async function globalSetup() {
  if (config.Memory) {
    // Global MongoMemoryServer instance
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;

    // Generate a unique database name for each test suite
    const uniqueDbName = uuidv4();
    process.env.MONGODB_URI = `${uri.slice(0, uri.lastIndexOf('/'))}/${uniqueDbName}`;
  } else {
    process.env.MONGODB_URI = `mongodb://${config.IP}:${config.Port}/${config.Database}`;
  }

  // Make sure the database is clean before the test suite starts
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  await conn?.connection?.db?.dropDatabase();
  await mongoose.disconnect();
}
