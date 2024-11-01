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
      const categoryMock = genCategoryMock();
      await createCategory(categoryMock);

      const allModels = await CategoryModel.find();

      expect(allModels).toHaveLength(1);
      expect(allModels[0]).toMatchObject(categoryMock);
    });

    it('should return a JSON not Mongoose document', async () => {
      const categoryMock = genCategoryMock();
      const res = await createCategory(categoryMock);

      expect(res).not.toBeInstanceOf(CategoryModel);
    });
  });

  describe('getAllCategories()', () => {
    it('should return all categories', async () => {
      const categoryMock = genCategoryMock();
      await CategoryModel.create(categoryMock);

      const res = await getAllCategories();

      expect(res).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(res[0]).toMatchObject(categoryMock);
    });

    it('should return a JSON not Mongoose document', async () => {
      const categoryMock = genCategoryMock();
      await CategoryModel.create(categoryMock);

      const res = await getAllCategories();

      expect(res).not.toBeInstanceOf(CategoryModel);
    });
  });
});
