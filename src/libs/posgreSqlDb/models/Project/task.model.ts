import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { Project } from './project.model';
import { TaskList } from './taskList.model';

interface TaskAttributes {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'pending' | 'inProgress' | 'inReview' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type TaskCreationAttributes = Optional<TaskAttributes, 'id' | 'description' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public projectId!: string;
  public title!: string;
  public description?: string;
  public status!: TaskAttributes['status'];
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  // Associations
  public project?: Project;
  public taskLists?: TaskList[];
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
        references: {
            model: Project,
            key: 'id',
        },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'inProgress', 'inReview', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'task',
    timestamps: true,
    paranoid: true,
  }
);


Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
});

Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});