import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { corsConfigs } from './config/corsConfigs.js';
import { pinoConfigs } from './config/pinoConfigs.js';

const PORT = Number(env(ENV_VARS.PORT, 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors(corsConfigs));

  app.use(pino(pinoConfigs));

  app.get('/', (req, res) => {
    res.status(200).json({ data: 'students' });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
};
