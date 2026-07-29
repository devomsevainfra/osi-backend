import Job from "./../models/job.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createJob = withMongoErrorHandling(async (jobDetails) => {
  return await Job.create(jobDetails);
});

const LIST_FIELDS = {
  title: 1,
  department: 1,
  location: 1,
  employmentType: 1,
  experienceLevel: 1,
};

export const getJobsPaginated = withMongoErrorHandling(
  async ({ filter = {}, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(LIST_FIELDS),

      Job.countDocuments(filter),
    ]);

    return { jobs, totalJobs };
  }
);

export const getJobById = withMongoErrorHandling(async (jobId) => {
  return await Job.findById(jobId).select({ __v: 0 });
});

export const findJobById = withMongoErrorHandling(async (jobId) => {
  return await Job.findById(jobId);
});

export const updateJobById = withMongoErrorHandling(
  async (jobId, jobDetails) => {
    return await Job.findByIdAndUpdate(
      jobId,
      { $set: jobDetails },
      { new: true, runValidators: true }
    ).select({ __v: 0 });
  }
);

export const deleteJobById = withMongoErrorHandling(async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
});
