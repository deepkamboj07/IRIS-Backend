import { Router, Request, Response, NextFunction } from 'express';
import { ApiError } from '../libs/utils/httpResponse/ApiError';
import { IAuthenticatedRequest } from '../libs/utils/types/auth';
import { createPost, CreatePostAttributes, getPostsList } from '../controllers/posts.controller';

const router = Router();

router.get('/my-posts', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
        throw new ApiError('Unauthorized', 401);
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const { data,statusCode,success  } = await getPostsList(userId, page, limit, search);
    // Logic to handle GET request
    res.status(statusCode).json({ message: success ? 'GET request successful' : 'GET request failed', data });
  } catch (err: any) {
    console.error('Error in GET request:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error'
    });
  }
});

router.post('/create-post', async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError('Unauthorized', 401);
        }
        const body = req.body as CreatePostAttributes;
        const {data,statusCode,success,message} = await createPost(userId, body);
        res.status(statusCode).json({ message: success ? 'Post created successfully' : message, data });
    } catch (err: any) {
        console.error('Error in POST request:', err);
        res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
        });
    }
});

export default router;