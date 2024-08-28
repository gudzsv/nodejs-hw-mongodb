const CONTACT_TYPE = ['work', 'home', 'personal'];

const parseContactType = (type) => {
  if (typeof type !== 'string') return;
  if (CONTACT_TYPE.includes(type)) return type;
};

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return false;
};

export const parseFilterParams = (query) => {
  const { type, isFavorite } = query;

  return {
    type: parseContactType(type),
    isFavorite: parseBoolean(isFavorite),
  };
};
