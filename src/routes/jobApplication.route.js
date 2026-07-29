import express from "express";

import asyncHandler from "./../utils/asyncHandler.utils.js";
import validate from "./../middlewares/validate.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import authorize from "./../middlewares/authorization.middleware.js";

import * as JobApplicationValidator from "./../validator/jobApplication.validator.js";
import * as JobApplicationController from "./../controllers/jobApplication.controller.js";

const jobApplicationRouter = express.Router();

// Public — candidates submit applications, no auth
jobApplicationRouter.post(
  "/createApplication",
  validate(JobApplicationValidator.createJobApplicationRequestSchema),
  asyncHandler(JobApplicationController.createJobApplicationController)
);

// Admin/Recruiter only from here on
jobApplicationRouter.get(
  "/getApplications",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobApplicationValidator.getJobApplicationsRequestSchema),
  asyncHandler(JobApplicationController.getJobApplicationsController)
);

jobApplicationRouter.get(
  "/getApplicationById/:applicationId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobApplicationValidator.getJobApplicationByIdRequestSchema),
  asyncHandler(JobApplicationController.getJobApplicationByIdController)
);

jobApplicationRouter.patch(
  "/markApplicationAsRead/:applicationId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobApplicationValidator.markJobApplicationAsReadRequestSchema),
  asyncHandler(JobApplicationController.markJobApplicationAsReadController)
);

jobApplicationRouter.patch(
  "/updateApplicationStatus/:applicationId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobApplicationValidator.updateJobApplicationStatusRequestSchema),
  asyncHandler(JobApplicationController.updateJobApplicationStatusController)
);

// Delete — admin/recruiter only, never public
jobApplicationRouter.delete(
  "/deleteApplication/:applicationId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobApplicationValidator.deleteJobApplicationRequestSchema),
  asyncHandler(JobApplicationController.deleteJobApplicationController)
);

export default jobApplicationRouter;
