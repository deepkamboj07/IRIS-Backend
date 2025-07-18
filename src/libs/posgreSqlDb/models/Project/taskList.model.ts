import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { Task } from './task.model';

interface TaskListAttributes {
  id: string;
  taskId: string;
  detail: string;
  status: 'pending' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type TaskListCreationAttributes = Optional<TaskListAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class TaskList extends Model<TaskListAttributes, TaskListCreationAttributes> implements TaskListAttributes {
  public id!: string;
  public taskId!: string;
  public detail!: string;
  public status!: TaskListAttributes['status'];
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  // Associations
  public task?: Task;
}

TaskList.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
        references: {
            model: Task,
            key: 'id',
        },
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'taskList',
    timestamps: true,
    paranoid: true,
  }
);


Task.hasMany(TaskList, {
  foreignKey: 'taskId',
    as: 'taskLists',
});
TaskList.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task',
});