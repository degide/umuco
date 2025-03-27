
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  filePath: string,
  folder = 'umuco'
): Promise<cloudinary.UploadApiResponse> => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
  });
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<cloudinary.DeleteApiResponse> => {
  return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
