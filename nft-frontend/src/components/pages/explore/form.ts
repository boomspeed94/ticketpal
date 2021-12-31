import { Asserts, boolean, object, string } from 'yup';

export const exploreSchema = object({
  // filterLeaderBoardByType: string(),
  // filterLeaderBoardByDate: string(),
  unit: string(),
  productCategory: string(),
  productSort: string(),
  verify: boolean(),
});

export const ProductCategories = [
  'Concert/Theater',
  'Camp/Trip/Retreat',
  'Class/Training/Workshop',
  'Conference/Convention/Seminar',
  'Attractions',
  'Sport',
  'Meeting/Social Gathering',
];

export const ExtraProductCategories = ['ASTRO', 'ATEEZ'];

type SortAndFilter = {
  filter?: 'created-date' | 'instant-sale-price';
  sort?: 'asc' | 'desc';
};

export const SortDefaultValue = 'Recently added';

export const Sort: {
  [key: string]: SortAndFilter;
} = {
  'Recently added': { filter: 'created-date', sort: 'desc' },
  Cheapest: { filter: 'instant-sale-price', sort: 'asc' },
  'Highest price': { filter: 'instant-sale-price', sort: 'desc' },
  // 'Most liked': {},
} as const;

export type ExploreSchema = Asserts<typeof exploreSchema>;
