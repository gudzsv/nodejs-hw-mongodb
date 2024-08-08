import { SORT_ORDER } from '../constants/index.js';

const KEY_OF_CONTACT = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavorite',
  'contactType',
  'createdAt',
  'updatedAt',
];

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = Object.values(SORT_ORDER).includes(sortOrder);

  if (isKnownOrder) return sortOrder;

  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const isKnownKey = KEY_OF_CONTACT.includes(sortBy);

  if (isKnownKey) return sortBy;

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  return {
    sortOrder: parseSortOrder(sortOrder),
    sortBy: parseSortBy(sortBy),
  };
};
