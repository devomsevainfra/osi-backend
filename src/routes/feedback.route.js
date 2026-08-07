import express from "express";

import asyncHandler from "./../utils/asyncHandler.utils.js";
import validate from "./../middlewares/validate.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import authorize from "./../middlewares/authorization.middleware.js";
import { ROLES } from "./../constants/roles.constants.js";

import * as FeedbackValidator from "./../validator/feedback.validator.js";
import * as FeedbackController from "./../controllers/feedback.controller.js";

const feedbackRouter = express.Router();

feedbackRouter.post(
  "/createResponse",
  validate(FeedbackValidator.createFeedbackRequestSchema),
  asyncHandler(FeedbackController.createFeedbackController)
);

feedbackRouter.get(
  "/getAllResponses",
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.ADMIN, ROLES.ENGINEER, ROLES.RECRUITER)),
  validate(FeedbackValidator.getAllFeedbackRequestSchema),
  asyncHandler(FeedbackController.getAllFeedbackController)
);

feedbackRouter.patch(
  "/markAsRead/:feedbackId",
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.ADMIN, ROLES.ENGINEER)),
  validate(FeedbackValidator.markFeedbackAsReadRequestSchema),
  asyncHandler(FeedbackController.markFeedbackAsReadController)
);

export default feedbackRouter;
