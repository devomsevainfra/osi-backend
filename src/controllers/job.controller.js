import * as JobService from "./../services/job.service.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";

export const createJobController = async (req, res) => {
  const jobDetails = req.validated.body;

  const result = await JobService.createJobService(jobDetails);

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: result.message,
      data: result.data,
    })
  );
};

export const getJobsController = async (req, res) => {
  // req.isPrivilegedUser is set by the optional-auth middleware below (true if
  // a valid ADMIN/RECRUITER accessToken cookie was present, false otherwise).
  const isPrivilegedUser = Boolean(req.isPrivilegedUser);

  const result = await JobService.getJobsService(
    req.validated.query,
    isPrivilegedUser
  );

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const getJobByIdController = async (req, res) => {
  const { jobId } = req.validated.params;
  const isPrivilegedUser = Boolean(req.isPrivilegedUser);

  const result = await JobService.getJobByIdService(jobId, isPrivilegedUser);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const updateJobByIdController = async (req, res) => {
  const { jobId } = req.validated.params;
  const updateDetails = req.validated.body;

  const result = await JobService.updateJobByIdService(jobId, updateDetails);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const deleteJobByIdController = async (req, res) => {
  const { jobId } = req.validated.params;

  const result = await JobService.deleteJobByIdService(jobId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
