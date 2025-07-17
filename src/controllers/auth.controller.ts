
import bcrypt from 'bcryptjs';
import { ApiError } from '../libs/utils/httpResponse/ApiError';
import { User } from '../libs/posgreSqlDb/models/User/user.model';
import { generateToken } from '../libs/utils/utils';
import { ApiResponse } from '../libs/utils/httpResponse/apiResponse';
import { UserProfile } from '../libs/posgreSqlDb/models/User/userProfile.module';
import jwt from 'jsonwebtoken';

export const loginUser = async (email: string, password: string):Promise<ApiResponse> => {
  try{
    if (!email || !password) throw new ApiError('Email and password required', 400);

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError('User not found', 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError('Invalid credentials', 400);

  const token = await generateToken({ id: user.id, email: user.email });
    return {
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
            docs:{
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    profileImg: user.profileImg,
                },
                token,
            }
        },
    };
  } catch (error) {
    console.error('Login error:', error);
    const errMessage = error instanceof ApiError ? error.message : 'Internal server error';
    return {
      success: false,
      statusCode: error instanceof ApiError ? error.status : 500,
      message: errMessage,
    };
  }
};


export const registerUser = async ({
  email,
  username,
  password
}: {
  email: string;
  username: string;
  password: string;
}): Promise<ApiResponse> => {
  try{
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        throw new ApiError('Email already exists', 400);
    }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new ApiError('Username already exists', 400);
  }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        username,
        password: hashed,
        name: username, // Assuming name is same as username
        profileImg:'https://res.cloudinary.com/dcikepqrw/image/upload/v1752693066/default-user_qo6mkd.jpg'
    });

    await UserProfile.create({
        userId: user.id,
        bio: '',
    });


  const token = generateToken({ id: user.id, email: user.email });

  return {
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: {
        docs: {
            user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            profileImg: user.profileImg,
            },
            token,
        }
    }
}
  }catch(error){
    const errMessage = error instanceof ApiError ? error.message : 'Internal server error';
    return {
      success: false,
      statusCode: error instanceof ApiError ? error.status : 500,
      message: errMessage,
    };
  }
};

export const verifyToken = async (token: string): Promise<ApiResponse> => {
  try {
    if (!token) throw new ApiError('No token provided', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) throw new ApiError('Invalid token', 401);

    const user = await User.findByPk((decoded as any).id);
    if (!user) throw new ApiError('User not found', 404);


    return {
      success: true,
      statusCode: 200,
      message: 'Token is valid',
      data: {
        docs: {
            user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            profileImg: user.profileImg,
            },
            token,
        }
      }
    };
  } catch (error) {
    console.error('Token verification error:', error);
    const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
    return {
      success: false,
      statusCode: error instanceof ApiError ? error.status : 500,
      message: errMessage,
    };
  }
}