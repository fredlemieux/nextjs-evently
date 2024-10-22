'use server';

import { CreateCategoryParams } from '@/types/parameters.types';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import { Category, ICategory } from '@/lib/database/models';
import { HydratedDocument } from 'mongoose';
import { documentToJson } from '@/lib/actions/utils.actions';

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams): Promise<ICategory | undefined> => {
  try {
    await connectToDatabase();

    const newCategory: HydratedDocument<ICategory> = await Category.create({
      name: categoryName,
    });

    return documentToJson(newCategory);
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async (): Promise<ICategory[] | undefined> => {
  try {
    await connectToDatabase();

    const categories: HydratedDocument<ICategory>[] = await Category.find();

    return documentToJson(categories);
  } catch (error) {
    handleError(error);
  }
};
