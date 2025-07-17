import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

// Define interface for model attributes
interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  name?: string;
  profileImg?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Optional fields during creation
type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'name' | 'profileImg' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

// Define the model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public name?: string;
  public profileImg?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  // Associations can be declared here if needed
  // public posts?: Post[]; 
  // public profile?: UserProfile;
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImg: {
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
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Enables soft delete (deletedAt)
    indexes: [
      {
        unique: true,
        fields: ['email'],
        name: 'email_index_users',
      },
      {
        fields: ['username'],
        name: 'username_index_users',
      },
    ],
  }
);

// ✅ Export model
export { User };
