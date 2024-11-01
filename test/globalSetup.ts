import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  // Global MongoMemoryServer instance
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;

  // Generate a base uri string for each test suite
  const mongoUri = `${uri.slice(0, uri.lastIndexOf('/'))}`;
  // Create a base URL for all tests to utilise...
  process.env.MONGODB_URI_BASE = mongoUri;
}
