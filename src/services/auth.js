import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/users.js';
import { HTTP_STATUSES, TOKEN_PARAMS } from '../constants/index.js';
import { env } from '../utils/env.js';
import { SessionCollection } from '../db/models/sessions.js';

const { CONFLICT, NOT_FOUND, UNAUTHORIZED } = HTTP_STATUSES;

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(CONFLICT, 'Email in use’');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(env('SALT')),
  );

  return await UserCollection.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(NOT_FOUND, 'User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(UNAUTHORIZED, 'User not authorized');
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
    throw createHttpError(NOT_FOUND, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(UNAUTHORIZED, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...TOKEN_PARAMS,
  });
};

export const logoutUser = async (sessionId) => {};
