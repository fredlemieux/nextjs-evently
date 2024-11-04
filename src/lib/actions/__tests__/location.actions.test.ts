import { genLocationMock } from '@test/data/location.data';
import {
  createLocation,
  createLocationIfNotExists,
} from '@/lib/actions/location.actions';
import { LocationModel } from '@/lib/database/models';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { seedLocation } from '@test/seeds/location.seed';

describe('Location Actions', () => {
  setupDatabaseTest();

  describe('createLocation()', () => {
    it('should create one location', async () => {
      const locationMock = genLocationMock();

      await createLocation(locationMock);

      const allLocations = await LocationModel.find();

      expect(allLocations).toHaveLength(1);
      expect(allLocations[0]).toMatchObject(locationMock);
    });

    it('should return JSON not a MongoDb Model', async () => {
      const locationMock = genLocationMock();

      const res = await createLocation(locationMock);

      expect(res).not.toBeInstanceOf(LocationModel);
    });
  });

  describe('createLocationIfNotExists()', () => {
    it('should create a new Location if there is none', async () => {
      const locationMock = genLocationMock();
      await createLocationIfNotExists(locationMock);

      const allLocations = await LocationModel.find();

      expect(allLocations).toHaveLength(1);
      expect(allLocations[0]).toMatchObject(locationMock);
    });

    it('should not create a new location if it exists in db', async () => {
      const locationSeedModel = await seedLocation();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...locationSeedJson } = JSON.parse(
        JSON.stringify(locationSeedModel)
      );
      await createLocationIfNotExists(locationSeedJson);

      const allLocations = await LocationModel.find();

      expect(allLocations).toHaveLength(1);
      expect(allLocations[0]).toMatchObject(locationSeedJson);
    });

    it('should not return JSON not MongoDb model', async () => {
      const locationMock = genLocationMock();
      const createdLocationRes = await createLocationIfNotExists(locationMock);
      const createdExisingLocation =
        await createLocationIfNotExists(locationMock);

      expect(createdLocationRes).not.toBeInstanceOf(LocationModel);
      expect(createdExisingLocation).not.toBeInstanceOf(LocationModel);
    });
  });
});
