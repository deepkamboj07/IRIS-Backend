import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { cloudinary } from '../libs/cloudinary/index';
import { ApiResponse } from '../libs/utils/httpResponse/apiResponse';
import { ApiError } from '../libs/utils/httpResponse/ApiError';
import { responseMessage } from '../libs/utils/helper/responseMessage';

export const uploadImage = async (
  file: Express.Multer.File
): Promise<ApiResponse> => {
  try {
    console.log('File received:', file);
    if (!file) throw new ApiError('No file uploaded', 400);

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'user_uploads',
      public_id: uuidv4(),
    });

    console.log('Cloudinary upload result:', result);

    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });

    return {
      success: true,
      statusCode: 200,
      message: 'File uploaded successfully',
      data: { 
        docs: {
          url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            createdAt: result.created_at,
            originalFilename: path.basename(file.originalname),
        }
       },
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    const errMessage =
      error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR;
    const statusCode = error instanceof ApiError ? error.status : 500;

    return {
      success: false,
      statusCode,
      message: errMessage,
      error: error as Error,
    };
  }
};
