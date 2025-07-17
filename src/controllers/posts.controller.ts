import { User } from "../libs/posgreSqlDb/models/User/user.model";
import { ApiResponse } from "../libs/utils/httpResponse/apiResponse";
import { ApiError } from "../libs/utils/httpResponse/ApiError";
import { Post } from "../libs/posgreSqlDb/models/Posts/post.model";
import { PostImage } from "../libs/posgreSqlDb/models/Posts/postImage.models";
import { sequelize } from "../libs/posgreSqlDb/config/database";

export const getPostsList = async(userId: string, page: number, limit: number, search: string): Promise<ApiResponse> => {
  try {

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const posts = await Post.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'profileImg']
        },
        {
          model: PostImage,
          as: 'images',
          attributes: ['id', 'imageUrl']
        }
      ],
      attributes: {
            exclude: ['updatedAt', 'deletedAt'],
        },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
        limit: limit,
        distinct: true,
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Posts fetched successfully',
      data: { docs: posts.rows, total: posts.count, page, limit }
    };
  } catch (error) {
    const errMessage = error instanceof ApiError ? error.message : 'Internal server error';
    return {
      success: false,
      statusCode: error instanceof ApiError ? error.status : 500,
      message: errMessage
    };
  }
}

export type CreatePostAttributes = {
    title: string;
    content: string;
    images?: string[]; // Array of image URLs
};

export const createPost = async (userId: string, post: CreatePostAttributes): Promise<ApiResponse> => {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const user = await User.findByPk(userId, { transaction });
            if (!user) {
                throw new ApiError('User not found', 404);
            }

            const newPost = await Post.create({
                userId,
                title: post.title,
                content: post.content
            }, { transaction });

            if (post.images && post.images.length > 0) {
                const images = post.images.map(imageUrl => ({
                    postId: newPost.id,
                    imageUrl
                }));
                await PostImage.bulkCreate(images, { transaction });
            }

            const postWithImages = await Post.findByPk(newPost.id, {
                include: [
                    {
                        model: PostImage,
                        as: 'images',
                        attributes: ['id', 'imageUrl']
                    }
                ],
                attributes: {
                    exclude: ['updatedAt', 'deletedAt'],
                },

                transaction
            });

            const userWithPost = {
                ...postWithImages?.toJSON(),
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    profileImg: user.profileImg
                }
            }

            return {
                success: true,
                statusCode: 201,
                message: 'Post created successfully',
                data: { docs: userWithPost } 
            }
    });
    return result;
} catch (error) {
    const errMessage = error instanceof ApiError ? error.message : 'Internal server error';
    return {
        success: false,
        statusCode: error instanceof ApiError ? error.status : 500,
        message: errMessage
    };
}
}