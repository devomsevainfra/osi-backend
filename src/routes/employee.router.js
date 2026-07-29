import { Router } from "express";

import asyncHandler from "../utils/asyncHandler.utils.js";
import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

import { uploadTeamFiles } from "../middlewares/teamMulter.middleware.js";

import * as TeamValidator from "../validator/employee.validator.js";
import * as TeamController from "../controllers/employee.controller.js";

const teamRouter = Router();

teamRouter.get(
  "/getAllTeamMembers",
  asyncHandler(TeamController.getAllTeamMembersController)
);

teamRouter.post(
  "/createTeamMember",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  uploadTeamFiles,
  validate(TeamValidator.createTeamMemberRequestSchema),
  asyncHandler(TeamController.createTeamMemberController)
);

teamRouter.patch(
  "/editTeamMember/:teamMemberId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  uploadTeamFiles,
  validate(TeamValidator.editTeamMemberRequestSchema),
  asyncHandler(TeamController.editTeamMemberController)
);

teamRouter.delete(
  "/deleteTeamMember/:teamMemberId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  asyncHandler(TeamController.deleteTeamMemberByIdController)
);

export default teamRouter;
