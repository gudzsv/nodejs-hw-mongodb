import { isHttpError } from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import { MongooseError } from 'mongoose';

export const errorHandler = (error, req, res, next) => {
  let ERROR_STATUS;

  if (isHttpError(error)) {
    ERROR_STATUS = error.status;
    res.status(ERROR_STATUS).json({
      status: ERROR_STATUS,
      message: error.name,
      data: error,
    });
    return;
  }

  ERROR_STATUS = HTTP_STATUSES.INTERNAL_SERVER_ERROR;

  if (error instanceof MongooseError) {
    res.status(ERROR_STATUS).json({
      status: ERROR_STATUS,
      message: 'Mongoose error',
      data: { message: error.message },
    });
  }
  ` `;
  res.status(ERROR_STATUS).json({
    status: ERROR_STATUS,
    message: 'Something went wrong',
    data: { message: error.message },
  });
};
