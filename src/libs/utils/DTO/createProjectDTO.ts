export type CreateProjectDTO = {
    name: string;
    description: string;
    userId: string;
}

export type CreateProjectTaskDTO = {
    title: string;
    description?: string;
    projectId: string;
    taskList?: {
        detail: string;
    }[]
}

export type UpdateProjectTaskDTO = {
    title: string;
    description?: string;
    projectId: string;
    status?: 'pending' | 'inProgress' | 'inReview' | 'completed';
    taskLists?: {
        id: string;
        detail: string;
        status?: 'pending' | 'completed';
    }[]
}

export type CreateProjectTaskListDTO = {
    detail: string;
    taskId: string;
}

export type updateProjectTaskListDTO = {
    detail?: string;
    taskId: string;
    status?: 'pending' | 'completed';
}
