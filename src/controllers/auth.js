import createHttpError from 'http-errors';
import { registerUserService, loginUserService, refreshSessionService, logoutUserService } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createHttpError(400, 'Name, email, and password are required'));
  }

  try {
    const newUser = await registerUserService({ name, email, password });

    const {  ...userData } = newUser.toObject();

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, 'Email and password are required'));
  }

  try {
    const {  accessToken, refreshToken } = await loginUserService({ email, password });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(createHttpError(400, 'Refresh token is required'));
  }

  try {
    const { newAccessToken, newRefreshToken } = await refreshSessionService(refreshToken);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return next(createHttpError(400, 'Refresh token is required'));
    }
  
    try {
      await logoutUserService(refreshToken);
  
      res.clearCookie('refreshToken');
  
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
  
