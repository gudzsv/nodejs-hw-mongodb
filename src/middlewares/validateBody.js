import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const err = createHttpError(
      HTTP_STATUSES.BAD_REQUEST,
      'Bad request, body params is incorrect',
      {
        errors: error.details,
      },
    );
    next(err);
  }
};
