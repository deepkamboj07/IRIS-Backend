import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { Post } from './post.model';

interface PostImageAttributes {
  id: string;
  postId: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type PostImageCreationAttributes = Optional<
  PostImageAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class PostImage
  extends Model<PostImageAttributes, PostImageCreationAttributes>
  implements PostImageAttributes
{
  public id!: string;
  public postId!: string;
  public imageUrl!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;


}

PostImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
        references: {
            model: 'posts',
            key: 'id',
        },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'postImages',
    timestamps: true,
    paranoid: true,
  }
);

PostImage.belongsTo(Post, {
  foreignKey: 'postId',
    as: 'post',
});
Post.hasMany(PostImage, {
  foreignKey: 'postId',
  as: 'images',
});