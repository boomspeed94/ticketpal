import { CategoryModel } from '../models';

export const DEFAULT_CATEGORIES: CategoryModel[] = [
  { id: '1', name: 'Concert/Theater', tag: 'Concert/Theater', imageUrl: '', description: 'Concert/Theater category' },
  {
    id: '2',
    name: 'Camp/Trip/Retreat',
    tag: 'Camp/Trip/Retreat',
    imageUrl: '',
    description: 'Camp/Trip/Retreat category',
  },
  {
    id: '3',
    name: 'Class/Training/Workshop',
    tag: 'Class/Training/Workshop',
    imageUrl: '',
    description: 'Class/Training/Workshop category',
  },
  {
    id: '4',
    name: 'Conference/Convention/Seminar',
    tag: 'Conference/Convention/Seminar',
    imageUrl: '',
    description: 'Conference/Convention/Seminar category',
  },
  { id: '5', name: 'Attractions', tag: 'Attractions', imageUrl: '', description: 'Attractions category' },
  { id: '6', name: 'Sport', tag: 'Sport', imageUrl: '', description: 'Sport category' },
  {
    id: '7',
    name: 'Meeting/Social Gathering',
    tag: 'Meeting/Social Gathering',
    imageUrl: '',
    description: 'Meeting/Social Gathering category',
  },
];

  class CategoryController {
    async get(tagName: string): Promise<CategoryModel | undefined> {
      const category = DEFAULT_CATEGORIES.find((item) => {
        return item.tag === tagName;
      });

      return category;
    }

    async getAll(): Promise<CategoryModel[]> {
      const categories = DEFAULT_CATEGORIES;

      return categories;
    }
  };

export const categoryController = new CategoryController();
