import { COOKIES, HTTP_STATUSES, THIRTY_DAYS } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../services/auth.js';

const { CREATED, OK, NO_CONTENT } = HTTP_STATUSES;

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(CREATED).json({
    status: CREATED,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser({
    email: req.body.email,
    password: req.body.password,
  });

  setupSession(res, session);

  res.status(OK).json({
    status: OK,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.status(OK).json({
    status: OK,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie(COOKIES.SESSION_ID);
  res.clearCookie(COOKIES.REFRESH_TOKEN);

  res.status(NO_CONTENT).send();
};
