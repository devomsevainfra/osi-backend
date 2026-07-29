import express from "express";

import asyncHandler from "./../utils/asyncHandler.utils.js";
import validate from "./../middlewares/validate.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import authorize from "./../middlewares/authorization.middleware.js";

import * as ProjectValidator from "./../validator/project.validator.js";
import * as ProjectController from "./../controllers/project.controller.js";

import { uploadProjectImages } from "./../middlewares/projectMulter.middleware.js";

const projectRouter = express.Router();

projectRouter.post(
  "/createProject",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "ENGINEER")),
  uploadProjectImages,
  validate(ProjectValidator.createProjectRequestSchema),
  asyncHandler(ProjectController.createProjectController)
);
projectRouter.get(
  "/getAllProjects",
  validate(ProjectValidator.getAllProjectsRequestSchema),
  asyncHandler(ProjectController.getAllProjectsController)
);

projectRouter.get(
  "/getAllFeaturedProjects",
  validate(ProjectValidator.getAllFeaturedProjectsRequestSchema),
  asyncHandler(ProjectController.getAllFeaturedProjectsController)
);

projectRouter.get(
  "/getProjectById/:projectId",
  validate(ProjectValidator.getProjectByIdRequestSchema),
  asyncHandler(ProjectController.getProjectByIdController)
);

projectRouter.patch(
  "/updateProject/:projectId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "ENGINEER")),
  uploadProjectImages,
  validate(ProjectValidator.updateProjectByIdRequestSchema),
  asyncHandler(ProjectController.updateProjectByIdController)
);

projectRouter.delete(
  "/deleteProject/:projectId",
  validate(ProjectValidator.deleteProjectByIdRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "ENGINEER")),
  asyncHandler(ProjectController.deleteProjectByIdController)
);

projectRouter.get(
  "/getFeaturedProjectsList",
  validate(ProjectValidator.getFeaturedProjectsListRequestSchema),
  asyncHandler(ProjectController.getFeaturedProjectsListController)
);

projectRouter.get(
  "/getNonFeaturedProjectsList",
  validate(ProjectValidator.getNonFeaturedProjectsListRequestSchema),
  asyncHandler(ProjectController.getNonFeaturedProjectsListController)
);

export default projectRouter;
