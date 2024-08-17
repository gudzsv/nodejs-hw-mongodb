import mongoose from 'mongoose';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/index.js';

export const initMongoConnection = async () => {
  try {
    const user = env(ENV_VARS.MONGODB_USER);
    const pwd = env(ENV_VARS.MONGODB_PASSWORD);
    const url = env(ENV_VARS.MONGODB_URL);
    const db = env(ENV_VARS.MONGODB_DB);

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster01`,
      // `mongodb+srv://admin:admin@cluster0.wld8a.mongodb.net`,
    );

    console.log(`Mongo connection successfully established!`);
  } catch (error) {
    console.error(`Error while setting up mongo connection`, error);
    throw error;
  }
};
