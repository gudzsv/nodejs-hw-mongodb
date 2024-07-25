import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { ENV_VARS, HTTP_STATUSES } from './constants/index.js';
import { corsConfigs } from './config/corsConfigs.js';
import { pinoConfigs } from './config/pinoConfigs.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env(ENV_VARS.PORT, 3000));
const STATUS_OK = HTTP_STATUSES.OK;
const STATUS_NOT_FOUND = HTTP_STATUSES.NOT_FOUND;

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors(corsConfigs));

  app.use(pino(pinoConfigs));

  app.get('/contacts', async (req, res) => {
    const data = await getAllContacts();

    res.status(STATUS_OK).json({
      status: STATUS_OK,
      message: 'Successfully found contacts!',
      data: data,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    console.log('contact: ', contact);
    if (!contact) {
      res
        .status(STATUS_NOT_FOUND)
        .json({ status: STATUS_NOT_FOUND, message: 'Contact not found' });
      return;
    }
    res.status(STATUS_OK).json({
      status: STATUS_OK,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res, next) => {
    const url = req.url;
    res.status(STATUS_NOT_FOUND).json({
      status: STATUS_NOT_FOUND,
      message: `Route ${url} Not found`,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
};
