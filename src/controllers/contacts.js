import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseAllParams } from '../utils/parseAllParams.js';

let STATUS_OK = HTTP_STATUSES.OK;
const STATUS_CREATED = HTTP_STATUSES.CREATED;
const STATUS_NO_CONTENT = HTTP_STATUSES.NO_CONTENT;

export const getContactsController = async (req, res) => {
  const params = parseAllParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContacts(params, userId);

  res.status(STATUS_OK).json({
    status: STATUS_OK,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (contact === null) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  res.status(STATUS_OK).json({
    status: STATUS_OK,
    message: `Successfully found contact with id ${contact._id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavorite: req.body.isFavorite,
    contactType: req.body.contactType,
    userId: req.user._id,
  });

  res.status(STATUS_CREATED).json({
    status: STATUS_CREATED,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const upsertUserController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await updateContact(contactId, userId, req.body);

  if (result.data === null) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  const status = result?.isNew ? STATUS_CREATED : STATUS_OK;

  res.status(status).json({
    status: status,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (contact === null) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  res.status(STATUS_NO_CONTENT).send();
};
