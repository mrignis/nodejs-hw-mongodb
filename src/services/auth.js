// src/services/auth.js
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User  from '../db/user.js';
import { Session } from '../db/Session.js';
import { TEMPLATES_DIR,ENV_VARS } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
const JWT_SECRET = 'your_jwt_secret';
const JWT_ACCESS_EXPIRATION = '15m';
const JWT_REFRESH_EXPIRATION = '30d';
import Handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import {validateGoogleOAuthCode} from "../utils/googleOAuth.js";



const createSession = () => {
  return {
    accessToken: crypto.randomBytes(40).toString('base64'),
    refreshToken: crypto.randomBytes(40).toString('base64'),
    accessTokenValidUntil: Date.now() + 1000 * 60 * 15, // 15 minutes,
    refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days,
  };
};



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

export const sendResetPasswordEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User is not found!');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m', // встановлюємо термін дії токену на 5 хвилин
    },
  );

  const templateSource = await fs.readFile(
    path.join(TEMPLATES_DIR, 'reset-password-email.html'),
  );

  const template = Handlebars.compile(templateSource.toString());

  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.FRONTEND_HOST)}/reset-password?token=${token}`,
  });

  try {
    await sendMail({
      html,
      to: email,
      from: env(ENV_VARS.SMTP_FROM),
      subject: 'Reset your password!',
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Problem with sending emails');
  }
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;
  try {
    tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, err.message);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    {
      _id: tokenPayload.sub,
      email: tokenPayload.email,
    },
    { password: hashedPassword },
  );
};


export const loginOrSignupWithGoogleOAuth = async (code) => {
  const payload = await validateGoogleOAuthCode(code);

  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(
      crypto.randomBytes(40).toString('base64'),
      10,
    );

    user = await User.create({
      name: payload.given_name + ' ' + payload.family_name,
      email: payload.email,
      password: hashedPassword,
    });
  }

  await Session.deleteOne({
    userId: user._id,
  });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};
