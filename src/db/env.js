// db/env.js

import dotenv from 'dotenv';
dotenv.config();

export const env = (key) => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};
