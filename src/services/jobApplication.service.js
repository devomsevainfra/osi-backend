import * as JobApplicationRepo from "./../repositories/jobApplication.repository.js";
import * as JobRepo from "./../repositories/job.repository.js";
import AppError from "./../utils/AppError.utils.js";

export const createJobApplicationService = async (applicationDetails) => {
  const { jobId, email, phoneNumber } = applicationDetails;

  const job = await JobRepo.findJobById(jobId);

  if (!job) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Job not found",
      error: new Error("Job not found"),
    });
  }

  if (!job.isLive) {
    throw new AppError({
      httpStatusCode: 400,
      message: "This job is no longer accepting applications",
      error: new Error("Job is not live"),
    });
  }

  const duplicateApplication =
    await JobApplicationRepo.findDuplicateApplication({
      jobId,
      email,
      phoneNumber,
    });

  if (duplicateApplication) {
    throw new AppError({
      httpStatusCode: 409,
      message:
        "You have already applied for this job with the same email and phone number",
      error: new Error("Duplicate application"),
    });
  }

  const createdApplication =
    await JobApplicationRepo.createJobApplication(applicationDetails);

  return {
    success: true,
    message: "Application submitted successfully",
    data: createdApplication,
  };
};

export const getJobApplicationsService = async ({
  page,
  limit,
  jobId,
  status,
  isRead,
  minExperience,
  maxExperience,
  search,
}) => {
  const filter = {};

  if (jobId) filter.jobId = jobId;
  if (status) filter.status = status;
  if (typeof isRead === "boolean") filter.isRead = isRead;

  if (minExperience !== undefined || maxExperience !== undefined) {
    filter.experienceYears = {};
    if (minExperience !== undefined)
      filter.experienceYears.$gte = minExperience;
    if (maxExperience !== undefined)
      filter.experienceYears.$lte = maxExperience;
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { currentLocation: { $regex: search, $options: "i" } },
      { currentOrganisation: { $regex: search, $options: "i" } },
    ];
  }

  const { applications, totalApplications } =
    await JobApplicationRepo.getJobApplicationsPaginated({
      filter,
      page,
      limit,
    });

  const totalPages = Math.ceil(totalApplications / limit) || 1;

  return {
    success: true,
    message: "Applications fetched successfully",
    data: {
      applications: applications || [],
      pagination: {
        page,
        limit,
        totalApplications: totalApplications || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

export const getJobApplicationByIdService = async (applicationId) => {
  const application =
    await JobApplicationRepo.getJobApplicationById(applicationId);

  if (!application) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Application not found",
      error: new Error("Application not found"),
    });
  }

  return {
    success: true,
    message: "Application fetched successfully",
    data: application,
  };
};

export const markJobApplicationAsReadService = async (applicationId) => {
  const updatedApplication =
    await JobApplicationRepo.markJobApplicationAsReadById(applicationId);

  if (!updatedApplication) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Application not found",
      error: new Error("Application not found"),
    });
  }

  return {
    success: true,
    message: "Application marked as read",
    data: updatedApplication,
  };
};

export const updateJobApplicationStatusService = async (
  applicationId,
  status
) => {
  const updatedApplication =
    await JobApplicationRepo.updateJobApplicationStatusById(
      applicationId,
      status
    );

  if (!updatedApplication) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Application not found",
      error: new Error("Application not found"),
    });
  }

  return {
    success: true,
    message: "Application status updated successfully",
    data: updatedApplication,
  };
};

export const deleteJobApplicationService = async (applicationId) => {
  const existingApplication =
    await JobApplicationRepo.findJobApplicationById(applicationId);

  if (!existingApplication) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Application not found",
      error: new Error("Application not found"),
    });
  }

  const deletedApplication =
    await JobApplicationRepo.deleteJobApplicationById(applicationId);

  return {
    success: true,
    message: "Application deleted successfully",
    data: {
      applicationId: deletedApplication._id,
    },
  };
};
