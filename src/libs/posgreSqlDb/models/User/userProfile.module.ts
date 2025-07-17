import { DataTypes, Model, Optional } from 'sequelize';
import { User } from './user.model';
import { sequelize } from '../../config/database';

interface UserProfileAttributes {
  id: string;
  userId: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  skills?: string[];
  college?: string;
  company?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type UserProfileCreationAttributes = Optional<
  UserProfileAttributes,
  'id' | 'bio' | 'address' | 'city' | 'country' | 'skills' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

class UserProfile
  extends Model<UserProfileAttributes, UserProfileCreationAttributes>
  implements UserProfileAttributes
{
  public id!: string;
  public userId!: string;
  public bio?: string;
  public address?: string;
  public city?: string;
  public country?: string;
  public skills?: string[];
  public college?: string;
  public company?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  // associations
  public user?: User;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    college: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
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
    sequelize:sequelize,
    tableName: 'userProfiles',
    timestamps: true,
    paranoid: true, // enables deletedAt
  }
);

// Associations
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });

export { UserProfile };
