import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  upsertUserController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/contacts/:contactId',
  validateBody(createContactSchema),
  ctrlWrapper(upsertUserController),
);

contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
