import { CategoryModel, ICategory } from '@/lib/database/models';
import { genCategoryMock } from '@test/data/category.data';

export async function categorySeed(): Promise<ICategory> {
  const categoryMock = genCategoryMock();
  return await CategoryModel.create(categoryMock);
}
