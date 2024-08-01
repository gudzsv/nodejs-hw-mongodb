import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import { getAllContacts, getContactById } from '../services/contacts.js';

const STATUS_OK = HTTP_STATUSES.OK;
const STATUS_NOT_FOUND = HTTP_STATUSES.NOT_FOUND;

export const getContactsController = async (req, res) => {
  const data = await getAllContacts();

  res.status(STATUS_OK).json({
    status: STATUS_OK,
    message: 'Successfully found contacts!',
    data: data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  res.status(STATUS_OK).json({
    status: STATUS_OK,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
