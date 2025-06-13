import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer'; // Import multer explicitly

// Allowed image types and file size
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Utility function to generate unique file names
const generateUniqueFileName = (file: any): string => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  let fileNameBase = file.originalname.split('.')[0];
  if (fileNameBase.length > 10) {
    fileNameBase = fileNameBase.slice(0, 10);
  }
  return `${fileNameBase}-${uniqueSuffix}`;
};

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: process.env.BUCKET_NAME,
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats for Cloudinary
    public_id: generateUniqueFileName(file),
  }),
});

// Multer middleware configuration
export const multerMiddleware: MulterOptions = {
  storage,
  fileFilter: (req, file, callback) => {
    // Check for valid MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          `Invalid file type. Allowed types are: ${ALLOWED_MIME_TYPES.join(', ')}`,
        ),
        false,
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return callback(
        new BadRequestException(
          `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
        ),
        false,
      );
    }

    callback(null, true); // File is valid
  },
  limits: {
    fileSize: MAX_FILE_SIZE, // Maximum file size in bytes
    files: 10, // Maximum number of files per upload
  },
};

// Function to delete an image from Cloudinary
export const deleteCloudinaryImage = async (
  publicId: string,
): Promise<boolean> => {
  try {
    // Extract public ID from full URL if needed
    const extractedPublicId = publicId.includes('cloudinary.com')
      ? publicId.split('/').slice(-1)[0].split('.')[0]
      : publicId;

    // Delete the image
    const result = await cloudinary.uploader.destroy(
      `${process.env.BUCKET_NAME}/${extractedPublicId}`,
    );

    // Check if deletion was successful
    if (result.result === 'ok') {
      return true;
    }
    console.log('result', result);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

// Export configuration constants
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  UPLOAD_FOLDER: process.env.BUCKET_NAME,
} as const;
