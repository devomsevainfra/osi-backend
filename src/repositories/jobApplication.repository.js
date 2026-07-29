import JobApplication from "./../models/jobApplication.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const findDuplicateApplication = withMongoErrorHandling(
  async ({ jobId, email, phoneNumber }) => {
    return await JobApplication.findOne({ jobId, email, phoneNumber });
  }
);

export const createJobApplication = withMongoErrorHandling(
  async (applicationDetails) => {
    return await JobApplication.create(applicationDetails);
  }
);

export const getJobApplicationsPaginated = withMongoErrorHandling(
  async ({ filter = {}, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [applications, totalApplications] = await Promise.all([
      JobApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("jobId", "title department location employmentType")
        .select({ __v: 0 }),

      JobApplication.countDocuments(filter),
    ]);

    return { applications, totalApplications };
  }
);

export const getJobApplicationById = withMongoErrorHandling(
  async (applicationId) => {
    return await JobApplication.findById(applicationId)
      .populate("jobId", "title department location employmentType")
      .select({ __v: 0 });
  }
);

export const findJobApplicationById = withMongoErrorHandling(
  async (applicationId) => {
    return await JobApplication.findById(applicationId);
  }
);

export const updateJobApplicationStatusById = withMongoErrorHandling(
  async (applicationId, status) => {
    return await JobApplication.findByIdAndUpdate(
      applicationId,
      { $set: { status } },
      { new: true, runValidators: true }
    ).select({ __v: 0 });
  }
);

export const markJobApplicationAsReadById = withMongoErrorHandling(
  async (applicationId) => {
    return await JobApplication.findByIdAndUpdate(
      applicationId,
      { $set: { isRead: true } },
      { new: true, runValidators: true }
    ).select({ __v: 0 });
  }
);

export const deleteJobApplicationById = withMongoErrorHandling(
  async (applicationId) => {
    return await JobApplication.findByIdAndDelete(applicationId);
  }
);
