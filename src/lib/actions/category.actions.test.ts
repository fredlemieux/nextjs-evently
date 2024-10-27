import { createCategory } from '@/lib/actions/category.actions';
import { Category } from '@/lib/database/models';
import { setupDatabaseTest } from '@test/utils/setupDatabaseTest';

describe('Category Actions', () => {
  setupDatabaseTest();
  describe('createCategory()', () => {
    it('should create a user', async () => {
      const category = 'Club night';
      await createCategory({ categoryName: category });
      const categories = await Category.find({});

      expect(categories.length).toBe(1);
      expect(categories[0].name).toBe(category);
    });

    it('should return a JSON not Mongoose Document', async () => {
      const category = 'Club night';
      const res = await createCategory({ categoryName: category });

      expect(res).not.toBeInstanceOf(Category);
    });
  });
});
