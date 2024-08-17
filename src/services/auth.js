import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/users.js';
import { TOKEN_PARAMS } from '../constants/index.js';
import { env } from '../utils/env.js';
import { SessionCollection } from '../db/models/sessions.js';

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const user = await UserCollection.findOne({ email });

  if (user) {
    throw createHttpError.Conflict('Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, Number(env('SALT')));

  return await UserCollection.create({ ...userData, password: hashedPassword });
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError.Unauthorized('User not authorized');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError.Unauthorized('User not authorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  return await SessionCollection.create({ userId: user._id, ...TOKEN_PARAMS });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError.NotFound('Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError.Unauthorized('Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...TOKEN_PARAMS,
  });
};

export const logoutUser = async (sessionId) => {
  const session = await SessionCollection.findById(sessionId);

  if (!session) {
    throw createHttpError.NotFound('Session not found');
  }

  await SessionCollection.deleteOne({ _id: sessionId });
};
