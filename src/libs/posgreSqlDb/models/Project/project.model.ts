import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { Task } from './task.model';
import { User } from '../User/user.model';

interface ProjectAttributes {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type ProjectCreationAttributes = Optional<ProjectAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
    public userId?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  // Associations
  public tasks?: Task[];
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references:{
        model:User,
        key: 'id',
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'project',
    timestamps: true,
    paranoid: true,
  }
);
