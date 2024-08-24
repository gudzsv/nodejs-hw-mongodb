import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import { UserCollection } from '../db/models/users.js';
import { EMAIL_TEMPLATE, ENV_VARS, TOKEN_PARAMS } from '../constants/index.js';
import { env } from '../utils/env.js';
import { SessionCollection } from '../db/models/sessions.js';
import { generateJwtToken } from '../utils/generateJwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEncryptedPassword } from '../utils/getEncryptedPassword.js';

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const user = await UserCollection.findOne({ email });

  if (user) {
    throw createHttpError.Conflict('Email in use');
  }

  return await UserCollection.create({
    ...userData,
    password: await getEncryptedPassword(password),
  });
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

export const sendResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError.NotFound('User not found!');
  }

  const token = generateJwtToken(user._id, email);

  const emailTemplatePath = path.join(
    EMAIL_TEMPLATE.TEMPLATES_DIR,
    EMAIL_TEMPLATE.TEMPLATE_FILE_NAME,
  );

  const templateSource = (await fs.readFile(emailTemplatePath)).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.APP_DOMAIN)}/reset-password?token=${token}`,
  });

  try {
    await sendEmail({
      from: env(ENV_VARS.BREVO.SMTP_FROM),
      to: email,
      subject: `${user.name} Please reset your password`,
      html,
    });
  } catch (error) {
    throw createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (token, password) => {
  let userData;
  try {
    userData = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError.Unauthorized('Token is expired or invalid.');
    }
    throw error;
  }

  const user = await UserCollection.findOne({
    email: userData.email,
    _id: userData.sub,
  });

  if (!user) {
    throw createHttpError.Unauthorized('User not found!');
  }

  await UserCollection.updateOne({
    _id: user._id,
    password: await getEncryptedPassword(password),
  });

  await SessionCollection.findOneAndDelete({ userId: user._id });
};
