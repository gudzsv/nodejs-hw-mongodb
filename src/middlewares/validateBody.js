import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessages = error.details
      .map((err) => {
        return err.message.replace(/"/g, '');
      })
      .join(', ');
    console.log('===>error: ', errorMessages);
    const err = createHttpError(
      HTTP_STATUSES.BAD_REQUEST,
      'Bad request, body parameters are incorrect',
      {
        errors: errorMessages.replace(/\\/g, ''),
      },
    );
    next(err);
  }
};
