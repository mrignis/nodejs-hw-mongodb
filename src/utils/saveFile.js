import { saveFileToLocalMachine } from './saveFileToUploadDir.js';
import { uploadToCloudinary } from '../services/cloudinary.js';

export const saveFile = async (photo) => {
  if (!photo) return undefined;

  let url;
  if (process.env.IS_CLOUDINARY_ENABLED === 'true') {
    url = await uploadToCloudinary(photo);
  } else {
    url = await saveFileToLocalMachine(photo);
  }

  return url;
};
