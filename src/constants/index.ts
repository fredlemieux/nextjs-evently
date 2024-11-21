export const headerLinks = [
  {
    t: 'home',
    route: '/',
  },
  {
    t: 'create',
    route: '/events/create',
  },
  {
    t: 'profile',
    route: '/profile',
  },
];

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: true,
  url: '',
};
