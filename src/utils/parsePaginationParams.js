import { DEFAULT_PAGINATION_DATA } from '../constants/index.js';

const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';

  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);

  if (Number.isNaN(parsedNumber)) return defaultValue;

  return Math.abs(parsedNumber);
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  return {
    page: parseNumber(page, DEFAULT_PAGINATION_DATA.PAGE),
    perPage: parseNumber(perPage, DEFAULT_PAGINATION_DATA.PER_PAGE),
  };
};
