import { Request, Response } from 'express';
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  ErrorCode,
} from '../utils/index.js';
import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';

const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (await Project.findOne({ name }))
    throw new ApiError(
      409,
      'Project with same name still exists',
      ErrorCode.VALIDATION_ERROR
    );

  const newProject = await Project.create({
    name,
    description,
    createdBy: req.user?._id,
    companyId: req.user?.companyId,
  });

  if (!newProject) throw new ApiError(500, 'DB Error', ErrorCode.DATABASE_ERROR);
  res.json(new ApiResponse(200, 'New Project Created', newProject));
});

const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', batchSize = '10' } = req.query as {
    page?: string;
    batchSize?: string;
  };
  const results = await Project.find({ companyId: req.user?.companyId })
    .skip((parseInt(page) - 1) * parseInt(batchSize))
    .limit(parseInt(batchSize));
  res.status(200).json(new ApiResponse(200, 'Projects lists fetched', results));
});

const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          'Project not found',
          ErrorCode.DATA_NOT_FOUND_ERROR
        )
      );
  }
  await Task.deleteMany({ projectId: id });
  res
    .status(200)
    .json(new ApiResponse(200, 'Project deleted successfully', deleted));
});

const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const project = await Project.findById(id);

  if (!project) {
    return res
      .status(404)
      .json(
        new ApiError(404, 'Project not found', ErrorCode.DATA_NOT_FOUND_ERROR)
      );
  }

  if (name && name !== project.name) {
    const existing = await Project.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            'A project with this name already exists',
            ErrorCode.VALIDATION_ERROR
          )
        );
    }
    project.name = name;
  }

  if (description !== undefined) {
    project.description = description;
  }

  const updated = await project.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Project updated successfully', updated));
});

export {
  createProject,
  getProjects,
  deleteProject,
  updateProject
};
