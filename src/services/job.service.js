import * as JobRepo from "./../repositories/job.repository.js";
import AppError from "./../utils/AppError.utils.js";

export const createJobService = async (jobDetails) => {
  const createdJob = await JobRepo.createJob(jobDetails);

  return {
    success: true,
    message: "Job created successfully",
    data: createdJob,
  };
};

export const getJobsService = async (
  { page, limit, department, employmentType, location, search, isLive },
  isPrivilegedUser = false
) => {
  const filter = {};

  if (department) filter.department = department;
  if (employmentType) filter.employmentType = employmentType;
  if (location) filter.location = { $regex: location, $options: "i" };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (isPrivilegedUser) {
    // Admin/Recruiter can optionally filter by isLive; otherwise sees everything.
    if (typeof isLive === "boolean") filter.isLive = isLive;
  } else {
    // Public: only isLive: true jobs. Expired jobs still show — no deadline filtering.
    filter.isLive = true;
  }

  const { jobs, totalJobs } = await JobRepo.getJobsPaginated({
    filter,
    page,
    limit,
  });

  const totalPages = Math.ceil(totalJobs / limit) || 1;

  return {
    success: true,
    message: "Jobs fetched successfully",
    data: {
      jobs: jobs || [],
      pagination: {
        page,
        limit,
        totalJobs: totalJobs || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

export const getJobByIdService = async (jobId, isPrivilegedUser = false) => {
  const job = await JobRepo.getJobById(jobId);

  if (!job || (!isPrivilegedUser && !job.isLive)) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Job not found",
      error: new Error("Job not found"),
    });
  }

  return {
    success: true,
    message: "Job fetched successfully",
    data: job,
  };
};

export const updateJobByIdService = async (jobId, updateDetails) => {
  const existingJob = await JobRepo.findJobById(jobId);

  if (!existingJob) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Job not found",
      error: new Error("Job not found"),
    });
  }

  const updatedJob = await JobRepo.updateJobById(jobId, updateDetails);

  return {
    success: true,
    message: "Job updated successfully",
    data: updatedJob,
  };
};

export const deleteJobByIdService = async (jobId) => {
  const existingJob = await JobRepo.findJobById(jobId);

  if (!existingJob) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Job not found",
      error: new Error("Job not found"),
    });
  }

  const deletedJob = await JobRepo.deleteJobById(jobId);

  return {
    success: true,
    message: "Job deleted successfully",
    data: {
      jobId: deletedJob._id,
    },
  };
};
