// import { UserRankType } from 'components/molecules/userRank';
import { User } from 'components/organisms/productCard';
import { ViewTabItemProps } from 'components/molecules/viewTabItem';
import avatar from 'assets/images/avatar.png';

export const users: User[] = [
  { src: avatar, alt: '', type: 'Owner', name: 'John' },
  { src: avatar, alt: '', type: 'Creator', name: 'Alice' },
];

export const fakeUsers: User[] = [
  {
    src: avatar,
    alt: '',
    type: 'Creator',
    name: 'hxe52720…bb46f9ba',
  },
];

export const myEvents = [
  {
    name: `El Clasico 2022`,
    location: 'Camp Nou',
    organizer: 'Barcelona official',
    alt: '',
    bmp: 2000,
    imageUrl: 'https://media-cdn.laodong.vn/storage/newsportal/2019/12/18/772994/0.jpg',
    userList: fakeUsers,
    amount: 1,
    id: 0,
    price: 80,
    type: 'event',
    status: 'view',
  },
  {
    name: `Blackpink: The Show 2`,
    location: 'Zoom',
    organizer: 'YG Entertainment',
    alt: '',
    bmp: 2000,
    imageUrl:
      'https://media-cdn.laodong.vn/storage/newsportal/2020/12/5/859890/Blackpink.jpg?w=960&crop=auto&scale=both',
    userList: fakeUsers,
    amount: 2,
    id: 1,
    price: 100,
    type: 'event',
    status: 'created',
  },
  {
    name: `Web summit 2021`,
    location: 'Zoom',
    organizer: 'Web Summit',
    alt: '',
    bmp: 2000,
    imageUrl:
      'data:image/jpeg;base64,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xY+rEk/qZsaGjOnnfMLRGF72NtC2agltv+k1YBzjnhcYPrLvS8Vq1Gj1VjkLrfDPRZzA75eWy3Hmwxg49vaaJEvbSi05MNz4zofHmrUUWU57quq2t7VRq2TOeR6rz6ic7+O10arRojrZXp6xpr3Xmjh8CwD/AHKowR8ppJEmR6LpM7GG3dpmqpbT6Klg1db9+7AggvY/w5PqqYH1md27091jah1r0Xc8nFi914khVXPxZ3HmCMemBNCjERpYmJzyMPQuJ8V0x1L0ao7tNt0moQr8WLK0XcnLydQVP/pnVXxbv10drsoZteXI3D4F5BR7AAAZ9poUYlfQRjmYej8Vbauu7/wtdNgtNLUsi6i192aw2w5cHzB9fnOPFKLbtNplpTROvhaa2a01d8jbeYVmOVxnPsZ50BGIjQx1+39mG/6Dimnro4YLUrYEan425vQ29dlmM4xkgnI/Lny56hx2mxNTaLHD2bixcEEPu5hxjlgg9PLp5SviXpp8M5z5zkw2/j3DLE4dpQ3dlqW1LXAXVsR3li7OjfFnPlmYvDON6NNQtp0hrCK+zu7TYe8ONthFpx8I3Y9yPSa1iTEae2Jn3/cw3HitNOo0+hqpew2u+rCG96xzewFzaV/MWxtx1yfOa7wvhLXagUbkQ5YOzMNqhT8R9/Yecw6LmRg6Eqw5gjqD6g+s68Sa0msYiR6G7eE1Gl/ZroabCoIuR7GexGVtRYF6dT8hK3wPhtNq62sqZ9S1FOnC2q29RYT3pwfhXB6nzmnARiUjR8fOcmG78Q4K+m0b10tS25Q+rs75NxC8xRWmc7R5nq39J0cP4ZYeFXL8G6x6bkBurBKKvM4Lcseh5zT8RiT6Occ+ueX9mCTETMkiIgIiIGSutPmAf6Tn40eh/WYcSvBDm37p7Jac8H0mf2ym1voP1M6LLmbqeXp5ThERWIZtHsHZ9Gc0pGfr+SIiWbhERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERED//Z',
    userList: fakeUsers,
    amount: 2,
    id: 2,
    price: 100,
    type: 'event',
    status: 'expired',
  },
];

export const myTickets = [
  {
    name: `El Clasico 2022`,
    location: 'Camp Nou',
    organizer: 'Barcelona official',
    alt: '',
    bmp: 2000,
    imageUrl: 'https://media-cdn.laodong.vn/storage/newsportal/2019/12/18/772994/0.jpg',
    userList: fakeUsers,
    amount: 1,
    id: 0,
    price: 80,
    type: 'ticket',
    status: 'onsale',
  },
  {
    name: `El Clasico 2022`,
    location: 'Camp Nou',
    organizer: 'Barcelona official',
    alt: '',
    bmp: 2000,
    imageUrl: 'https://media-cdn.laodong.vn/storage/newsportal/2019/12/18/772994/0.jpg',
    userList: fakeUsers,
    amount: 1,
    id: 1,
    price: 80,
    type: 'ticket',
    status: 'available',
  },
  {
    name: `Blackpink: The Show 2`,
    location: 'Zoom',
    organizer: 'YG Entertainment',
    alt: '',
    bmp: 2000,
    imageUrl:
      'https://media-cdn.laodong.vn/storage/newsportal/2020/12/5/859890/Blackpink.jpg?w=960&crop=auto&scale=both',
    userList: fakeUsers,
    amount: 2,
    id: 2,
    price: 100,
    type: 'ticket',
    status: 'available',
  },
  {
    name: `Web summit 2021`,
    location: 'Zoom',
    organizer: 'Web Summit',
    alt: '',
    bmp: 2000,
    imageUrl:
      'data:image/jpeg;base64,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xY+rEk/qZsaGjOnnfMLRGF72NtC2agltv+k1YBzjnhcYPrLvS8Vq1Gj1VjkLrfDPRZzA75eWy3Hmwxg49vaaJEvbSi05MNz4zofHmrUUWU57quq2t7VRq2TOeR6rz6ic7+O10arRojrZXp6xpr3Xmjh8CwD/AHKowR8ppJEmR6LpM7GG3dpmqpbT6Klg1db9+7AggvY/w5PqqYH1md27091jah1r0Xc8nFi914khVXPxZ3HmCMemBNCjERpYmJzyMPQuJ8V0x1L0ao7tNt0moQr8WLK0XcnLydQVP/pnVXxbv10drsoZteXI3D4F5BR7AAAZ9poUYlfQRjmYej8Vbauu7/wtdNgtNLUsi6i192aw2w5cHzB9fnOPFKLbtNplpTROvhaa2a01d8jbeYVmOVxnPsZ50BGIjQx1+39mG/6Dimnro4YLUrYEan425vQ29dlmM4xkgnI/Lny56hx2mxNTaLHD2bixcEEPu5hxjlgg9PLp5SviXpp8M5z5zkw2/j3DLE4dpQ3dlqW1LXAXVsR3li7OjfFnPlmYvDON6NNQtp0hrCK+zu7TYe8ONthFpx8I3Y9yPSa1iTEae2Jn3/cw3HitNOo0+hqpew2u+rCG96xzewFzaV/MWxtx1yfOa7wvhLXagUbkQ5YOzMNqhT8R9/Yecw6LmRg6Eqw5gjqD6g+s68Sa0msYiR6G7eE1Gl/ZroabCoIuR7GexGVtRYF6dT8hK3wPhtNq62sqZ9S1FOnC2q29RYT3pwfhXB6nzmnARiUjR8fOcmG78Q4K+m0b10tS25Q+rs75NxC8xRWmc7R5nq39J0cP4ZYeFXL8G6x6bkBurBKKvM4Lcseh5zT8RiT6Occ+ueX9mCTETMkiIgIiIGSutPmAf6Tn40eh/WYcSvBDm37p7Jac8H0mf2ym1voP1M6LLmbqeXp5ThERWIZtHsHZ9Gc0pGfr+SIiWbhERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERED//Z',
    userList: fakeUsers,
    amount: 2,
    id: 3,
    price: 100,
    type: 'ticket',
    status: 'expired',
  },
];

export const eventList = [
  {
    name: `El Clasico 2022`,
    location: 'Camp Nou',
    organizer: 'Barcelona official',
    alt: '',
    bmp: 2000,
    imageUrl: 'https://media-cdn.laodong.vn/storage/newsportal/2019/12/18/772994/0.jpg',
    userList: fakeUsers,
    amount: 1,
    id: 0,
    price: 80,
    type: 'event',
  },
  {
    name: `Blackpink: The Show`,
    location: 'Zoom',
    organizer: 'YG Entertainment',
    alt: '',
    bmp: 2000,
    imageUrl:
      'https://media-cdn.laodong.vn/storage/newsportal/2020/12/5/859890/Blackpink.jpg?w=960&crop=auto&scale=both',
    userList: fakeUsers,
    amount: 2,
    id: 1,
    price: 100,
    type: 'event',
  },
  {
    name: `Web Summit 2022`,
    location: 'Lisbon',
    organizer: 'Web Summit',
    alt: '',
    bmp: 2000,
    imageUrl:
      'https://web-summit-library.imgix.net/websummit/2121/11/51647356340_d1bdc4836b_k.jpg?auto=compress%2Cformat&ixlib=php-3.3.0&s=8c5f7817c82be20fe93c12e00fcf349e',
    userList: fakeUsers,
    amount: 10,
    id: 2,
    price: 10,
    type: 'event',
  },
  {
    name: `Cosmoprof Hongkong`,
    location: 'Hongkong Convention & Exhibition Center',
    organizer: 'www.Cosmoprof-asia.com',
    alt: '',
    bmp: 2000,
    imageUrl: 'https://images.tkbcdn.com/1/1560/600/Upload/eventcover/2021/03/26/718CAC.jpg',
    userList: fakeUsers,
    amount: 10,
    id: 3,
    price: 0,
    type: 'event',
  },
];

export const marketResell = [
  ...Array(4)
    .fill(0)
    .map((_, idx) => ({
      name: `El Clasico 2022`,
      location: 'Camp Nou',
      organizer: 'Barcelona official',
      alt: '',
      bmp: 2000,
      imageUrl: 'https://media-cdn.laodong.vn/storage/newsportal/2019/12/18/772994/0.jpg',
      userList: fakeUsers,
      amount: 1,
      id: idx,
      price: 100,
    })),
  ...Array(8)
    .fill(0)
    .map((_, idx) => ({
      name: `Blackpink: The Show`,
      location: 'Zoom',
      organizer: 'YG Entertainment',
      alt: '',
      bmp: 2000,
      imageUrl:
        'https://media-cdn.laodong.vn/storage/newsportal/2020/12/5/859890/Blackpink.jpg?w=960&crop=auto&scale=both',
      userList: fakeUsers,
      amount: 2,
      id: idx,
      price: 150,
    })),
  ...Array(8)
    .fill(0)
    .map((_, idx) => ({
      name: `Web Summit 2022`,
      location: 'Lisbon',
      organizer: 'Web Summit',
      alt: '',
      bmp: 2000,
      imageUrl:
        'https://web-summit-library.imgix.net/websummit/2121/11/51647356340_d1bdc4836b_k.jpg?auto=compress%2Cformat&ixlib=php-3.3.0&s=8c5f7817c82be20fe93c12e00fcf349e',
      userList: fakeUsers,
      amount: 10,
      id: idx + 4,
      price: 10,
    })),
];

type dummyInfoTab = Omit<ViewTabItemProps, 'lead'> & {
  userType?: string;
  saleprice?: string;
  date?: string;
  bid?: string;
};

export const viewInfoTab: { [key: string]: dummyInfoTab[] } = {
  History: [
    {
      from: 'hxe527...f9ba',
      to: 'hxb555...99bc',
      image: avatar,
      saleprice: '100',
      date: '46 minutes ago',
    },
    {
      from: 'hxe527...f9ba',
      to: 'hxb555...99bc',
      image: avatar,
      saleprice: '70',
      date: 'Nov 29, 2021',
    },
    {
      from: 'hxe527...f9ba',
      to: 'hxb555...99bc',
      image: avatar,
      saleprice: '60',
      date: 'Nov 22, 2021',
    },
    {
      from: 'hxe527...f9ba',
      to: 'hxb555...99bc',
      image: avatar,
      saleprice: '30',
      date: 'Nov 20, 2021',
    },
  ],
};
