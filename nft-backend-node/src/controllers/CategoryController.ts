import { CategoryModel } from '../models';

export const DEFAULT_CATEGORIES: CategoryModel[]  = [
  { id: '386b738d-fe87-4e5d-afb2-a6fea21daf17', name: 'Korean Idol', tag: 'idol', imageUrl: '', description: 'This is a test category 1' },
  { id: '4f4bdd02-feac-471c-9969-1d1f8c0bfbcf', name: 'Sport', tag: 'sport', imageUrl: '', description: 'This is a test category 2' },
  { id: '43c72305-7f53-49d8-a17f-5ce774573a8e', name: 'Musical', tag: 'musical', imageUrl: '', description: 'This is a test category 3' },
];

class CategoryController {
  async get(tagName: string): Promise<CategoryModel | undefined> {
    const category = DEFAULT_CATEGORIES.find((item) => {return item.tag === tagName });

    return category;
  }

  async getAll(): Promise<CategoryModel[]> {
    const categories = DEFAULT_CATEGORIES;

    return categories;
  }
}

export const categoryController = new CategoryController();