import { Request } from 'express';
import { ApiResponse } from '../libs/utils/httpResponse/apiResponse';
import { ApiError } from '../libs/utils/httpResponse/ApiError';
import { User } from '../libs/posgreSqlDb/models/User/user.model';
import { UserProfile } from '../libs/posgreSqlDb/models/User/userProfile.module';
import { Post } from '../libs/posgreSqlDb/models/Posts/post.model';
import { PostImage } from '../libs/posgreSqlDb/models/Posts/postImage.models';

// GET: Fetch my details
export const getMyProfile = async (userId:string): Promise<ApiResponse> => {
  try {
    if (!userId) throw new ApiError('Unauthorized', 401);

    const user = await User.findByPk(userId);
    const profile = await UserProfile.findOne({ where: { userId }, raw: true });

    if (!user || !profile) throw new ApiError('User not found', 404);

    const totalPosts = await Post.count({ where: { userId } });
    const totalImageUploaded = await PostImage.count({
      include: [{
        model: Post,
        as: 'post',
        required: true,
        where: { userId }
      }]
    });

    return {
      success: true,
      statusCode: 200,
      message: 'User profile fetched successfully',
      data: {
        docs: {
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            details: profile,
            totalPosts: totalPosts,
            totalImageUploaded: totalImageUploaded
          }
        }
      }
    };
  } catch (error) {
    const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
    return {
      success: false,
      statusCode: error instanceof ApiError ? error.status : 500,
      message: errMessage
    };
  }
};

// PATCH: Update my details (partial update allowed)
export const updateMyProfile = async (userId:string,body:any): Promise<ApiResponse> => {
  try {

    if (!userId) throw new ApiError('Unauthorized', 401);

    const { name, username, profileImg, bio, skills, college, address, city, country, company } = body as {
      name?: string;
        username?: string;
        profileImg?: string;
        bio?: string;
        skills?: string[];
        college?: string;
        address?: string;
        city?: string;
        country?: string;
        company?: string;
    }

    const user = await User.findByPk(userId);
    const profile = await UserProfile.findOne({ where: { userId } });

    if (!user || !profile) throw new ApiError('User not found', 404);

    // Update user fields
    if (name) user.name = name;
    if (username){
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser && existingUser.id !== userId) {
        throw new ApiError('Username already exists', 400);
      }
      user.username = username;
    }
    if (profileImg) user.profileImg = profileImg;
    await user.save();

    // Update profile fields
    if (bio) profile.bio = bio;
    if (skills) profile.skills = skills;
    if (college) profile.college = college;
    if (company) profile.company = company;
    if (address) profile.address = address;
    if (city) profile.city = city;
    if (country) profile.country = country;
    await profile.save();

    const totalPosts = await Post.count({ where: { userId } });
    const totalImageUploaded = await PostImage.count({
      include: [{
        model: Post,
        as: 'post',
        required: true,
        where: { userId }
      }]
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: {
        docs: {
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            details: profile,
            totalPosts: totalPosts,
            totalImageUploaded: totalImageUploaded
          }
        }
      }
    };
  } catch (error) {
    const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
    return {
      success: false,
      statusCode: error instanceof ApiError ? error.status : 500,
      message: errMessage
    };
  }
};
