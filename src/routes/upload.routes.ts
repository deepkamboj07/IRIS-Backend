import express from 'express';
import { uploadImage } from '../controllers/upload.controller';
import upload from '../libs/multer/multer';
import httpsResponse from '../libs/utils/httpResponse/httpsResponse';


const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try{
    const file = req.file;
    if(!file) {
       return httpsResponse(req, res, 400, 'A file is required', null);
    }
    const response = await uploadImage(file);
    if (!response.success) {
      return httpsResponse(req, res, response.statusCode, response.message, null);
    }
    return httpsResponse(req, res, response.statusCode, response.message, response.data);
  }catch (error) {
    return httpsResponse(req, res, 500, 'Internal Server Error', null);
  }
});

export default router;
