import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { corsConfigs } from './config/corsConfigs.js';
import { pinoConfigs } from './config/pinoConfigs.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env(ENV_VARS.APP_PORT, 3000));

export const setupServer = () => {
  const app = express();

  app.use(cors(corsConfigs));

  app.use(cookieParser());

  app.use(pino(pinoConfigs));

  app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
};
