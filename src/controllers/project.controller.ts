import { ApiError } from "../libs/utils/httpResponse/ApiError";
import { ApiResponse } from "../libs/utils/httpResponse/apiResponse";
import { Project } from "../libs/posgreSqlDb/models/Project/project.model";
import { CreateProjectDTO, CreateProjectTaskDTO, UpdateProjectTaskDTO } from "../libs/utils/DTO/createProjectDTO";
import { Task } from "../libs/posgreSqlDb/models/Project/task.model";
import { TaskList } from "../libs/posgreSqlDb/models/Project/taskList.model";
import { sequelize } from "../libs/posgreSqlDb/config/database";

export const getAllProjects = async(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    userId?: string
):Promise<ApiResponse>=>{
    try{

        const projects = await Project.findAndCountAll({
            where: {
                userId: userId,
            },
            offset: (page - 1) * limit,
            limit: limit,
            order: [['createdAt', 'DESC']],
        });

        return {
            success: true,
            statusCode: 200,
            message: 'Projects fetched successfully',
            data: {
                docs: projects.rows,
                total: projects.count,
                page,
                limit,
            }
        };
    }catch(error){
        const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
            return {
            success: false,
            statusCode: error instanceof ApiError ? error.status : 500,
            message: errMessage
            };
    }
}

export const createProject = async (projectData: CreateProjectDTO): Promise<ApiResponse> => {
    try {

        if (!projectData.name || !projectData.userId) {
            throw new ApiError('Name and User ID are required', 400);
        }
        const project = await Project.create({
            name: projectData.name,
            description: projectData.description,
            userId: projectData.userId
        });
        return {
            success: true,
            statusCode: 201,
            message: 'Project created successfully',
            data: { docs: project }
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

export const getProjectById = async (projectId: string): Promise<ApiResponse> => {
    try {
        const project = await Project.findByPk(projectId,{
            include: [{
                model: Task,
                as: 'tasks',
                required: false,
                include: [{
                    model: TaskList,
                    as: 'taskLists',
                    required: false
                }]
            }]
        });
        if (!project) {
            throw new ApiError('Project not found', 404);
        }
        return {
            success: true,
            statusCode: 200,
            message: 'Project fetched successfully',
            data: { docs: project }
        };
    } catch (error) {
        const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
        return {
            success: false,
            statusCode: error instanceof ApiError ? error.status : 500,
            message: errMessage
        };
    }
}

export const addTaskToProject = async (projectId: string, taskData: CreateProjectTaskDTO): Promise<ApiResponse> => {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const project = await Project.findByPk(projectId, { transaction });
            if (!project) {
                throw new ApiError('Project not found', 404);
            }

            const task = await Task.create({
                projectId: project.id,
                title: taskData.title,
                description: taskData.description,
                status: 'pending'
            }, { transaction });

            if (taskData.taskList && taskData.taskList.length > 0) {
                const taskLists = taskData.taskList.map(list => ({
                    taskId: task.id,
                    detail: list.detail,
                }));
                await TaskList.bulkCreate(taskLists, { transaction });
            }

            return {
                success: true,
                statusCode: 201,
                message: 'Task added to project successfully',
                data: { docs: task }
            };
        });
        return result;
    } catch (error) {
        const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
        return {
            success: false,
            statusCode: error instanceof ApiError ? error.status : 500,
            message: errMessage
        };
    }
}
export const updateTask = async (taskId: string, taskData: Partial<UpdateProjectTaskDTO>): Promise<ApiResponse> => {
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            throw new ApiError('Task not found', 404);
        }

        if (taskData.title) task.title = taskData.title;
        if (taskData.description) task.description = taskData.description;
        if (taskData.status) task.status = taskData.status;

        if (taskData.taskLists && taskData.taskLists.length > 0) {
            for (const list of taskData.taskLists) {
                const taskList = await TaskList.findByPk(list.id);
                if (taskList) {
                    if (list.detail) taskList.detail = list.detail;
                    if (list.status) taskList.status = list.status;
                    await taskList.save();
                } else {
                    throw new ApiError('Task List not found', 404);
                }
            }
        }

        await task.save();

        return {
            success: true,
            statusCode: 200,
            message: 'Task updated successfully',
            data: { docs: task }
        };
    } catch (error) {
        const errMessage = error instanceof ApiError ? error.message : 'Internal Server Error';
        return {
            success: false,
            statusCode: error instanceof ApiError ? error.status : 500,
            message: errMessage
        };
    }
}