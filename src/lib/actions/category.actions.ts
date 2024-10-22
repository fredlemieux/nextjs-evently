'use server';

import { CreateCategoryParams } from '@/types/parameters.types';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import { Category, ICategory } from '@/lib/database/models';
// import { documentToJson } from '@/lib/actions/utils.actions';

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams): Promise<ICategory | undefined> => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName });

    return newCategory.toJSON();
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async (): Promise<ICategory[] | undefined> => {
  try {
    await connectToDatabase();

    const categories = await Category.find();

    // TODO! Why doesn't this work?
    // return documentToJson<ICategory[]>(categories);
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
