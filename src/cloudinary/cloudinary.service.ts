import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary,
    private configService: ConfigService,
  ) {}

  async uploadImage(
    file: any,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadVideo(
    file: any,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'video',
          allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return false;
    }
  }

  async deleteVideo(publicId: string): Promise<boolean> {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',
      });
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting video from Cloudinary:', error);
      return false;
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
   * Returns: folder/image
   */
  extractPublicId(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex((part) => part === 'upload');
      if (uploadIndex === -1) return null;

      // Get everything after 'upload' and before the last part (which is the filename with version)
      const pathParts = urlParts.slice(uploadIndex + 2, -1);
      const filename = urlParts[urlParts.length - 1];

      // Remove version prefix if present (e.g., v1234567890_)
      const cleanFilename = filename.replace(/^v\d+_/, '');

      return pathParts.length > 0
        ? `${pathParts.join('/')}/${cleanFilename}`
        : cleanFilename;
    } catch (error) {
      console.error('Error extracting public ID from URL:', error);
      return null;
    }
  }

  /**
   * Delete multiple media files from Cloudinary
   */
  async deleteMultipleMedia(
    urls: string[],
    resourceType: 'image' | 'video' = 'image',
  ): Promise<void> {
    const deletePromises = urls.map((url) => {
      const publicId = this.extractPublicId(url);
      if (!publicId) {
        console.warn(`Could not extract public ID from URL: ${url}`);
        return Promise.resolve();
      }

      return resourceType === 'image'
        ? this.deleteImage(publicId)
        : this.deleteVideo(publicId);
    });

    await Promise.allSettled(deletePromises);
  }
}
