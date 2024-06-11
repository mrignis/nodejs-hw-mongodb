// src/services/auth.js
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/user.js';
import { Session } from '../db/Session.js';

const JWT_SECRET = 'your_jwt_secret';
const JWT_ACCESS_EXPIRATION = '15m';
const JWT_REFRESH_EXPIRATION = '30d';

export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const user = new User({ name, email, password });
  await user.save();

  return user;
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  await session.save();

  return { user, accessToken, refreshToken };
};

export const refreshSessionService = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  const session = await Session.findOneAndDelete({ refreshToken });

  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });
  const newRefreshToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

  const newSession = new Session({
    userId: decoded.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  await newSession.save();

  return { newAccessToken, newRefreshToken };
};

export const logoutUserService = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
};
