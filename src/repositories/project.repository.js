import Project from "./../models/project.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createProject = withMongoErrorHandling(async (projectDetails) => {
  return await Project.create(projectDetails);
});

export const getAllProjectsPaginated = withMongoErrorHandling(
  async ({ filter = {}, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [projects, totalProjects] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select({ __v: 0 }),

      Project.countDocuments(filter),
    ]);

    return {
      projects,
      totalProjects,
    };
  }
);

export const getProjectById = withMongoErrorHandling(async (projectId) => {
  return await Project.findById(projectId).select({ __v: 0 });
});

export const updateProjectById = withMongoErrorHandling(
  async (projectId, projectDetails) => {
    return await Project.findByIdAndUpdate(
      projectId,
      { $set: projectDetails },
      {
        new: true,
        runValidators: true,
      }
    ).select({ __v: 0 });
  }
);

export const findProjectById = withMongoErrorHandling(async (projectId) => {
  return await Project.findById(projectId);
});

export const deleteProjectById = withMongoErrorHandling(async (projectId) => {
  return await Project.findByIdAndDelete(projectId);
});

export const getAllFeaturedProjects = withMongoErrorHandling(async () => {
  return await Project.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .select({ __v: 0 });
});

export const getAllNonFeaturedProjectsList = withMongoErrorHandling(
  async () => {
    return await Project.find({ isFeatured: false })
      .sort({ createdAt: -1 })
      .select({
        title: 1,
        description: 1,
        category: 1,
        status: 1,
        location: 1,
        client: 1,
        startDate: 1,
      });
  }
);
