import { CategoryModel } from '../models';

export const DEFAULT_CATEGORIES: CategoryModel[]  = [
  { id: '386b738d-fe87-4e5d-afb2-a6fea21daf17', name: 'Concert', tag: 'concert', imageUrl: '', description: 'Concert category' },
  { id: '43c72305-7f53-49d8-a17f-5ce774573a8e', name: 'Camp', tag: 'camp', imageUrl: '', description: 'Camp category' },
  { id: 'fcdeb7fd-ed14-49c4-9045-a0310ef68a1c', name: 'Workshop', tag: 'workshop', imageUrl: '', description: 'Workshop category' },
  { id: '735b807b-5bb3-4200-94b1-1eb88886fcb3', name: 'Conference', tag: 'conference', imageUrl: '', description: 'Conference category' },
  { id: '5abc58eb-4fb3-40fd-89b7-c4b6fed37d4f', name: 'Attractions', tag: 'attractions', imageUrl: '', description: 'Attractions category' },
  { id: '4f4bdd02-feac-471c-9969-1d1f8c0bfbcf', name: 'Sport', tag: 'sport', imageUrl: '', description: 'Sport category' },
  { id: '4f4bdd02-feac-471c-9969-1d1f8c0bfbcf', name: 'Movie', tag: 'sport', imageUrl: '', description: 'Movie category' },
  { id: '4f4bdd02-feac-471c-9969-1d1f8c0bfbcf', name: 'Course', tag: 'sport', imageUrl: '', description: 'Course category' },
  { id: '080bc6ba-cb4c-47ed-a93f-d5a5563ebd0f', name: 'Event', tag: 'event', imageUrl: '', description: 'Event category' },
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