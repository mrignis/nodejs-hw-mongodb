
// src/utils/saveFileToUploadDir.js
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToLocalMachine = async (file) => {
  const content = await fs.readFile(file.path);
  const newPath = path.join(UPLOAD_DIR, file.filename);
  await fs.writeFile(newPath, content);
  await fs.unlink(file.path);

  const backendHost = env(process.env.BACKEND_HOST);
  const photoUrl = `${backendHost}/uploads/${file.filename}`;

  return photoUrl;
};
