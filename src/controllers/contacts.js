import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

const STATUS_OK = HTTP_STATUSES.OK;
const STATUS_CREATED = HTTP_STATUSES.CREATED;
const STATUS_NO_CONTENT = HTTP_STATUSES.NO_CONTENT;

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

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(STATUS_CREATED).json({
    status: STATUS_CREATED,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const upsertUserController = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);

  if (!result) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  const status = result?.isNew ? STATUS_CREATED : STATUS_OK;

  res.status(status).json({
    status: status,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  res.status(STATUS_NO_CONTENT).send();
};
