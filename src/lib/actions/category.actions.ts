'use server';

import { connectToDatabase } from '../database';
import {
  Category,
  CreateCategoryParams,
  ICategory,
} from '@/lib/database/models';
import { ToJSON } from '@/types/utility.types';
import { handleError } from '../utils';
import { documentToJson } from '@/lib/utils/mongoose.utils';

export const createCategory = async ({
  name,
}: CreateCategoryParams): Promise<ToJSON<ICategory> | undefined> => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({
      name,
    });

    return documentToJson(newCategory);
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async (): Promise<
  ToJSON<ICategory[]> | undefined
> => {
  try {
    await connectToDatabase();

    const categories = await Category.find();

    return documentToJson(categories);
  } catch (error) {
    handleError(error);
    return undefined;
  }
};
