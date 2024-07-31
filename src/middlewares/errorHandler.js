import { isHttpError } from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import { MongooseError } from 'mongoose';

export const errorHandler = (error, req, res, next) => {
  let ERR_STATUS;

  if (isHttpError(error)) {
    ERR_STATUS = error.status;
    res.status(ERR_STATUS).json({
      status: ERR_STATUS,
      message: error.name,
      data: error,
    });
    return;
  }

  ERR_STATUS = HTTP_STATUSES.INTERNAL_SERVER_ERROR;

  if (error instanceof MongooseError) {
    res.status(ERR_STATUS).json({
      status: ERR_STATUS,
      message: 'Mongoose error',
      data: { message: error.message },
    });
  }

  res.status(ERR_STATUS).json({
    status: ERR_STATUS,
    message: 'Something went wrong',
    data: error.message,
  });
};
