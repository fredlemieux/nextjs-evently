import { Mongoose } from 'mongoose';
import { connectToDatabase } from '../database';

describe('Category Actions', () => {
  let mongoose: Mongoose | undefined;

  beforeAll(async () => {
    mongoose = await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose?.connection.close();
  });

  it('should pass', () => {
    expect(true).toBeTruthy();
  });
});
