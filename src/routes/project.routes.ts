// src/routes/user.route.ts
import { Router, Request, Response } from 'express';
import { IAuthenticatedRequest } from '../libs/utils/types/auth';
import httpsResponse from '../libs/utils/httpResponse/httpsResponse';
import {
  getAllProjects,
  createProject,
  getProjectById,
  addTaskToProject,
  updateTask
} from '../controllers/project.controller';

const router = Router();

// GET all projects
router.get('/', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return httpsResponse(req, res, 401, 'Unauthorized', null);
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const result = await getAllProjects(page, limit, search, userId);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

// POST create a new project
router.post('/', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return httpsResponse(req, res, 401, 'Unauthorized', null);
    }

    const projectData = {
      ...req.body,
      userId
    };
    const result = await createProject(projectData);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

// GET a single project by ID
router.get('/:projectId', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const result = await getProjectById(projectId);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

// POST add a task to a project
router.post('/:projectId/tasks', async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const taskData = req.body;

    const result = await addTaskToProject(projectId, taskData);
    return httpsResponse(req, res, result.statusCode, result.message, result.data);
  } catch (err: any) {
    return httpsResponse(req, res, err.status || 500, err.message || 'Internal Server Error', null);
  }
});

// PATCH /api/tasks/:taskId - Update task by ID
router.patch('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const taskData = req.body;

  const result = await updateTask(taskId, taskData);
  res.status(result.statusCode).json(result);
});


export default router;
