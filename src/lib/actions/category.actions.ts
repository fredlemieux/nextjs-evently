'use server';

import {CreateCategoryParams} from '@/types/parameters.types';
import {handleError} from '../utils';
import {connectToDatabase} from '../database';
import {Category, ICategory} from '@/lib/database/models';

export const createCategory = async ({
                                       categoryName,
                                     }: CreateCategoryParams): Promise<ICategory | undefined> => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({name: categoryName});

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async (): Promise<ICategory[] | undefined> => {
  try {
    await connectToDatabase();

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
