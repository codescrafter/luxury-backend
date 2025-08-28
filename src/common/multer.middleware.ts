import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Allowed image types and file size
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Allowed video types and file size
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mov',
  'video/avi',
  'video/webm',
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Multer middleware configuration for images and videos
export const multerMiddleware: MulterOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    // Determine if this is an image or video based on field name
    const isImage = file.fieldname === 'images';
    const isVideo = file.fieldname === 'videos';

    let allowedTypes: string[];
    let maxSize: number;
    let typeName: string;

    if (isImage) {
      allowedTypes = ALLOWED_IMAGE_TYPES;
      maxSize = MAX_IMAGE_SIZE;
      typeName = 'image';
    } else if (isVideo) {
      allowedTypes = ALLOWED_VIDEO_TYPES;
      maxSize = MAX_VIDEO_SIZE;
      typeName = 'video';
    } else {
      return callback(
        new BadRequestException(
          'Invalid field name. Only "images" and "videos" are allowed.',
        ),
        false,
      );
    }

    // Check for valid MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          `Invalid ${typeName} type. Allowed types are: ${allowedTypes.join(', ')}`,
        ),
        false,
      );
    }

    // Check file size
    if (file.size > maxSize) {
      return callback(
        new BadRequestException(
          `${typeName} file size exceeds the ${maxSize / (1024 * 1024)}MB limit.`,
        ),
        false,
      );
    }

    callback(null, true); // File is valid
  },
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Use video size as max for mixed uploads
    files: 15, // Maximum number of files per upload (10 images + 5 videos)
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
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} as const;
