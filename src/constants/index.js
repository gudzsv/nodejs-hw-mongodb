export const ENV_VARS = {
  PORT: 'PORT',
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};

export const HTTP_STATUSES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const JOI_VALIDATION_MSG = {
  MIN: `'{{#label}}' must be at least '{{#limit}}'. You provided: '{{#value}}'`,
  MAX: `'{{#label}}' must be less than or equal to '{{#limit}}'. You provided: '{{#value}}'`,
  ONE_OF: `'{{#label}}' must be one of the following values: '{{#valids}}'. You provided: '{{#value}}'`,
  REQUIRED: `'{{#label}}' is a required field`,
  STRING: `'{{#label}} must be a string. You provided: '{{#value}}'`,
  NUMBER: `'{{#label}}' must be a number. You provided: '{{#value}}'`,
  INTEGER: `'{{#label}}' must be an integer. You provided: '{{#value}}'`,
  BOOLEAN: `'{{#label}}' must be a boolean value. You provided: '{{#value}}'`,
  PHONE_NUMBER: `'{{#label}}' must be a valid phone number. You provided: '{{#value}}'`,
  EMAIL: `'{{#label}}' must be a valid email address. You provided: '{{#value}}'`,
};

export const VALIDATION_LENGTH = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
};

export const DEFAULT_PAGINATION_DATA = {
  PAGE: 1,
  PER_PAGE: 10,
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
