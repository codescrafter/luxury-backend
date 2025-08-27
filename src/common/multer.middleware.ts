import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Allowed image types and file size
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Multer middleware configuration
export const multerMiddleware: MulterOptions = {
  storage: multer.memoryStorage(),
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
    const result = await cloudinary.uploader.destroy(extractedPublicId);

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
} as const;
