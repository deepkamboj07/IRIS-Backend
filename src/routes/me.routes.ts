// src/routes/user.route.ts
import { Router, Request, Response } from 'express';
import httpsResponse from '../libs/utils/httpResponse/httpsResponse';
import { IAuthenticatedRequest } from '../libs/utils/types/auth';
import { getMyProfile } from '../controllers/me.controller';
import { updateMyProfile } from '../controllers/me.controller';

const router = Router();

// GET /api/v1/me
router.get('/', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    console.log('Fetching user profile');
    const userId = req.userId;
    console.log('User ID:', userId);
    if (!userId) {
      return httpsResponse(req, res, 401, 'Unauthorized', null);
    }
    const result = await getMyProfile(userId);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

// PATCH /api/v1/me
router.patch('/', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return httpsResponse(req, res, 401, 'Unauthorized', null);
    }
    const updateData = req.body;
    const result = await updateMyProfile(userId, updateData);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

export default router;
