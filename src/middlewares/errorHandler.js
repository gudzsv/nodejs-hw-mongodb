import { HttpError } from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';

export const errorHandler = (error, req, res, next) => {
  let ERR_STATUS;

  if (error instanceof HttpError) {
    ERR_STATUS = error.status;
    res.status(ERR_STATUS).json({
      status: ERR_STATUS,
      message: error.name,
      data: error,
    });
    return;
  }

  ERR_STATUS = HTTP_STATUSES.INTERNAL_SERVER_ERROR;
  res.status(ERR_STATUS).json({
    status: ERR_STATUS,
    message: 'Something went wrong',
    data: error.message,
  });
};
