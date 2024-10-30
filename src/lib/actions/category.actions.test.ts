import {
  createCategory,
  getAllCategories,
} from '@/lib/actions/category.actions';
import { CategoryModel } from '@/lib/database/models';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';
import { genCategoryMock } from '@test/data/category.data';

describe('Category Actions', () => {
  setupDatabaseTest();

  describe('createCategory()', () => {
    it('should create the one category entry in MongoDb', async () => {
      const { name: nameMock } = genCategoryMock();
      await createCategory({ name: nameMock });

      const allModels = await CategoryModel.find();

      expect(allModels).toHaveLength(1);
      expect(allModels[0].name).toEqual(nameMock);
    });

    it('should return a JSON not Mongoose document', async () => {
      const { name } = genCategoryMock();
      const res = await createCategory({ name });

      expect(res).not.toBeInstanceOf(CategoryModel);
    });
  });

  describe('getAllCategories()', () => {
    it('should return all categories', async () => {
      const { name } = genCategoryMock();
      await CategoryModel.create({ name });

      const res = await getAllCategories();

      expect(res).toHaveLength(1);
    });

    it('should return a JSON not Mongoose document', async () => {
      const { name } = genCategoryMock();
      await CategoryModel.create({ name });

      const res = await getAllCategories();

      expect(res).not.toBeInstanceOf(CategoryModel);
    });
  });
});
