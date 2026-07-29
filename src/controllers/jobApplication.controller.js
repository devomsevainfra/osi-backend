import * as JobApplicationService from "./../services/jobApplication.service.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";

export const createJobApplicationController = async (req, res) => {
  const applicationDetails = req.validated.body;

  const result =
    await JobApplicationService.createJobApplicationService(applicationDetails);

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: result.message,
      data: result.data,
    })
  );
};

export const getJobApplicationsController = async (req, res) => {
  const result = await JobApplicationService.getJobApplicationsService(
    req.validated.query
  );

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const getJobApplicationByIdController = async (req, res) => {
  const { applicationId } = req.validated.params;

  const result =
    await JobApplicationService.getJobApplicationByIdService(applicationId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const markJobApplicationAsReadController = async (req, res) => {
  const { applicationId } = req.validated.params;

  const result =
    await JobApplicationService.markJobApplicationAsReadService(applicationId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const updateJobApplicationStatusController = async (req, res) => {
  const { applicationId } = req.validated.params;
  const { status } = req.validated.body;

  const result = await JobApplicationService.updateJobApplicationStatusService(
    applicationId,
    status
  );

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const deleteJobApplicationController = async (req, res) => {
  const { applicationId } = req.validated.params;

  const result =
    await JobApplicationService.deleteJobApplicationService(applicationId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
