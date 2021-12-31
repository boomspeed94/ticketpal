import { Asserts, mixed, number, array, object, string } from 'yup';
import { ProductCategories } from 'components/pages/explore/form';

export const createSchema = object({
  file: mixed().required(),
  // onsale: boolean(),
  // instantsale: boolean(),
  // instantsaleprice: number()
  //   .notRequired()
  //   .when('instantsale', (instantsale: boolean, schema: NumberSchema) => {
  //     return instantsale ? schema.required('Please input sale price.') : schema;
  //   }),

  price: number().required('Please input price of ticket'),
  quantity: number().required('Please input amount of ticket'),
  // unlockonbuy: boolean(),
  // lockedcontent: string(),
  // collection: string().required('Please choose collection.'),
  organizer: string().required('Please input organizer.'),
  name: string().required('Please enter event name.'),
  location: string().required('Please input location.'),
  startDay: string(),
  endDay: string(),
  description: string().required('Please input desc.'),
  // royalties: number().typeError('Please enter royalties.').required('Please enter royalties.'),
  // properties: string().notRequired(),
  categories: array(
    object().shape({
      name: string().required(),
      id: number().required(),
    })
  ).min(1, 'Please select at least 1 category.'),
});

export type CreateForm = Asserts<typeof createSchema>;

export const Unit = ['BNB', 'BUSD', 'CONT'];

export const Categories = [...ProductCategories].map((category, idx) => {
  return { id: idx, name: category };
});

export const initialValue: CreateForm = {
  // onsale: true,
  name: '',
  file: undefined,
  // collection: '',
  description: '',
  // instantsale: true,
  price: 0,
  quantity: 1,
  organizer: '',
  location: '',
  startDay: '',
  endDay: '',
  // lockedcontent: '',
  // unlockonbuy: false,
  // royalties: 0,
  // properties: undefined,
  categories: [],
};
