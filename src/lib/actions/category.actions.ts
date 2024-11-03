'use server';

import { connectToDatabase } from '../database';
import {
  CategoryModel,
  CreateCategoryMongoParams,
  ICategory,
} from '@/lib/database/models';
import { ToJSON } from '@/types/utility.types';
import { handleError } from '../utils';
import { documentToJSON } from '@/lib/utils/mongoose.utils';

export const createCategory = async ({
  name,
}: CreateCategoryMongoParams): Promise<ToJSON<ICategory> | undefined> => {
  try {
    await connectToDatabase();

    const newCategory = await CategoryModel.create({
      name,
    });

    return documentToJSON(newCategory);
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async (): Promise<
  ToJSON<ICategory[]> | undefined
> => {
  try {
    await connectToDatabase();

    const categories = await CategoryModel.find();

    return documentToJSON(categories);
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const getCategoryByName = async (name: string) => {
  return CategoryModel.findOne({ name: { $regex: name, $options: 'i' } });
};
