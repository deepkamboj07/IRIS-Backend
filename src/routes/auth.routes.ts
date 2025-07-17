import { Router, Request, Response, NextFunction } from 'express';
import { loginUser, registerUser, verifyToken } from '../controllers/auth.controller';
import httpsResponse from '../libs/utils/httpResponse/httpsResponse';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }
    const result = await loginUser(email, password);
    if (!result.success) {
      return httpsResponse(req, res, result.statusCode, result.message, null);
    }
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    console.error('Login Error:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error'
    });
  }
});

router.get('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      return httpsResponse(req, res, 401, 'No token provided', null);
    }

    const result = await verifyToken(token);

    if (!result.success) {
      return httpsResponse(req, res, 401, 'Invalid token', null);
    }

    // Token is valid
    return httpsResponse(req, res, 200, 'Token is valid', result.data);
  } catch (err: any) {
    console.error('Token verification error:', err);
    return httpsResponse(req, res, 500, 'Internal Server Error', null);
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const dto = req.body as {
        email: string;
        password: string;
        username: string;
    }

    if (!dto.email || !dto.password || !dto.username) {
      return httpsResponse(req, res, 400, 'Email, password, and username are required', null);
    }
    const result = await registerUser(dto);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

export default router;
