import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Конфігурація Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'contacts_photos', // Ви можете вказати свою директорію в Cloudinary
    });
    return result.secure_url; // Повертає URL завантаженого фото
  } catch (error) {
    throw new error('Failed to upload image to Cloudinary');
  }
};

export default cloudinary;
