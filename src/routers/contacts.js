import { Router } from 'express';
import {
  createContactController,
  getContactByIdController,
  getContactsController,
  upsertUserController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.patch('/contacts/:contactId', ctrlWrapper(upsertUserController));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

export default contactsRouter;
