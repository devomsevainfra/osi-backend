import express from "express";

import asyncHandler from "./../utils/asyncHandler.utils.js";
import validate from "./../middlewares/validate.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import authorize from "./../middlewares/authorization.middleware.js";

import * as Token from "./../utils/token.utils.js";
import Session from "./../models/session.model.js";

import * as JobValidator from "./../validator/job.validator.js";
import * as JobController from "./../controllers/job.controller.js";

const jobRouter = express.Router();

// Local, inline "soft auth" — same logic as authenticate(), but never blocks
// the request. Used only on public GET routes so admin/recruiter callers
// can get extra visibility (draft/non-live jobs) without requiring login.
const optionalAuthenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next();
    }

    const accessTokenResult = Token.verifyToken({
      value: accessToken,
      type: "ACCESS_TOKEN",
    });

    if (accessTokenResult.status === "VALID") {
      const { userId, sessionId, role } = accessTokenResult.decoded;
      req.authenticatedUser = { userId, sessionId, role };
      return next();
    }

    if (accessTokenResult.status === "EXPIRED") {
      const { sessionId } = accessTokenResult.decoded;
      const existingSession = await Session.findById(sessionId);

      if (!existingSession) {
        return next();
      }

      const refreshTokenResult = Token.verifyToken({
        value: existingSession.refreshToken,
        type: "REFRESH_TOKEN",
      });

      if (refreshTokenResult.status === "VALID") {
        const { role } = accessTokenResult.decoded;

        const newAccessToken = Token.createAccessToken({
          userId: existingSession.userId,
          sessionId: existingSession._id,
          role,
        });

        res.cookie("accessToken", newAccessToken, {
          maxAge: 1000 * 60 * 60 * 24,
        });

        req.authenticatedUser = {
          userId: existingSession.userId,
          sessionId: existingSession._id,
          role,
        };

        return next();
      }
    }

    return next();
  } catch (error) {
    return next();
  }
};

jobRouter.post(
  "/createJob",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobValidator.createJobRequestSchema),
  asyncHandler(JobController.createJobController)
);

jobRouter.get(
  "/getJobs",
  asyncHandler(optionalAuthenticate),
  validate(JobValidator.getJobsRequestSchema),
  asyncHandler(JobController.getJobsController)
);

jobRouter.get(
  "/getJobById/:jobId",
  asyncHandler(optionalAuthenticate),
  validate(JobValidator.getJobByIdRequestSchema),
  asyncHandler(JobController.getJobByIdController)
);

jobRouter.patch(
  "/updateJob/:jobId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobValidator.updateJobRequestSchema),
  asyncHandler(JobController.updateJobByIdController)
);

jobRouter.delete(
  "/deleteJob/:jobId",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN", "RECRUITER")),
  validate(JobValidator.deleteJobRequestSchema),
  asyncHandler(JobController.deleteJobByIdController)
);

export default jobRouter;
