import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { User } from '../User/user.model';
import { PostImage } from './postImage.models';

interface PostAttributes {
  id: string;
  userId: string;
  title: string;
  content: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type PostCreationAttributes = Optional<
  PostAttributes,
  'id' | 'likes' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public content!: string;
  public likes!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  // Associations
  public user?: User;
  public images?: PostImage[];
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
  }
);

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
});