import * as ProjectRepo from "./../repositories/project.repository.js";
import AppError from "./../utils/AppError.utils.js";
import { assertFeaturedProjectComplete } from "../utils/projectFeatured.validation.js";

import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "../utils/cloudinary.utils.js";

export const createProjectService = async (
  projectDetails,
  projectImages = []
) => {
  if (projectImages.length > 1) {
    throw new AppError({
      httpStatusCode: 400,
      message: "Projects can have only 1 image",
      error: new Error("Projects can have only 1 image"),
    });
  }

  const isFeatured = projectDetails.isFeatured === true;

  if (isFeatured) {
    assertFeaturedProjectComplete(projectDetails, {
      imageCount: projectImages.length,
    });
  }

  const uploadedImages = [];

  try {
    for (const image of projectImages) {
      console.log("Uploading image to Cloudinary:", image.originalname);

      const publicId = `${Date.now()}-${image.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase()}`;

      const uploadedImage = await uploadBufferToCloudinary({
        buffer: image.buffer,
        folder: process.env.CLOUDINARY_PROJECT_FOLDER || "omseva/projects",
        publicId,
      });

      console.log("Cloudinary upload success:", uploadedImage.secure_url);

      uploadedImages.push({
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      });
    }

    const createdProject = await ProjectRepo.createProject({
      ...projectDetails,
      images: uploadedImages,
    });

    return {
      success: true,
      message: "Project created successfully",
      data: {
        projectId: createdProject._id,
        title: createdProject.title,
        category: createdProject.category,
        status: createdProject.status,
        isFeatured: createdProject.isFeatured,
        isLive: createdProject.isLive,
        images: createdProject.images,
      },
    };
  } catch (error) {
    console.error("PROJECT_CREATION_ERROR:", error);

    await Promise.allSettled(
      uploadedImages.map((image) => deleteFromCloudinary(image.publicId))
    );

    throw new AppError({
      httpStatusCode: error.httpStatusCode || 500,
      message: error.message || "Project creation failed",
      error,
    });
  }
};

export const getAllProjectsService = async ({
  page,
  limit,
  category,
  status,
  isFeatured,
  isLive,
  search,
}) => {
  const filter = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (typeof isFeatured === "boolean") filter.isFeatured = isFeatured;
  if (typeof isLive === "boolean") filter.isLive = isLive;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { client: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const { projects, totalProjects } = await ProjectRepo.getAllProjectsPaginated(
    {
      filter,
      page,
      limit,
    }
  );

  const totalPages = Math.ceil(totalProjects / limit) || 1;

  return {
    success: true,
    message: "Projects fetched successfully",
    data: {
      projects,
      pagination: {
        page,
        limit,
        totalProjects,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

export const getAllFeaturedProjectsService = async (query) => {
  const result = await getAllProjectsService({
    ...query,
    isFeatured: true,
  });

  return {
    ...result,
    message: "Featured projects fetched successfully",
  };
};

export const getProjectByIdService = async (projectId) => {
  const project = await ProjectRepo.getProjectById(projectId);

  if (!project) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Project not found",
      error: new Error("Project not found"),
    });
  }

  return {
    success: true,
    message: "Project fetched successfully",
    data: project,
  };
};

const removeUndefinedFields = (object) => {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  );
};

const getImagesToRemove = (existingImages, removeImagePublicIds = []) => {
  if (removeImagePublicIds.length === 0) {
    return [];
  }

  const existingPublicIds = new Set(
    existingImages.map((image) => image.publicId)
  );

  const unknownPublicIds = removeImagePublicIds.filter(
    (publicId) => !existingPublicIds.has(publicId)
  );

  if (unknownPublicIds.length > 0) {
    throw new AppError({
      httpStatusCode: 400,
      message: "One or more project images do not exist on this project",
      error: new Error(
        `Invalid project image publicIds: ${unknownPublicIds.join(", ")}`
      ),
    });
  }

  const removePublicIdSet = new Set(removeImagePublicIds);

  return existingImages.filter((image) =>
    removePublicIdSet.has(image.publicId)
  );
};

export const updateProjectByIdService = async ({
  projectId,
  updateDetails,
  projectImages = [],
}) => {
  const existingProject = await ProjectRepo.findProjectById(projectId);

  if (!existingProject) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Project not found",
      error: new Error("Project not found"),
    });
  }

  const cleanedUpdateDetails = removeUndefinedFields(updateDetails);
  const { removeImagePublicIds = [], ...projectUpdateDetails } =
    cleanedUpdateDetails;

  const hasNewImages = projectImages.length > 0;
  const oldImages = existingProject.images || [];
  const imagesToRemove = getImagesToRemove(oldImages, removeImagePublicIds);
  const removePublicIdSet = new Set(
    imagesToRemove.map((image) => image.publicId)
  );
  const keptImages = oldImages.filter(
    (image) => !removePublicIdSet.has(image.publicId)
  );
  const finalImageCount = keptImages.length + projectImages.length;

  if (finalImageCount > 1) {
    throw new AppError({
      httpStatusCode: 400,
      message: "Projects can have only 1 image",
      error: new Error("Projects can have only 1 image"),
    });
  }

  const finalIsFeatured =
    projectUpdateDetails.isFeatured !== undefined
      ? projectUpdateDetails.isFeatured
      : existingProject.isFeatured;

  if (finalIsFeatured) {
    assertFeaturedProjectComplete(
      {
        title: projectUpdateDetails.title ?? existingProject.title,
        category: projectUpdateDetails.category ?? existingProject.category,
        status: projectUpdateDetails.status ?? existingProject.status,
        location: projectUpdateDetails.location ?? existingProject.location,
        client: projectUpdateDetails.client ?? existingProject.client,
        description:
          projectUpdateDetails.description ?? existingProject.description,
        budget: projectUpdateDetails.budget ?? existingProject.budget,
        startDate: projectUpdateDetails.startDate ?? existingProject.startDate,
        endDate: projectUpdateDetails.endDate ?? existingProject.endDate,
        teamLeader:
          projectUpdateDetails.teamLeader ?? existingProject.teamLeader,
        isLive: projectUpdateDetails.isLive ?? existingProject.isLive,
      },
      { imageCount: finalImageCount }
    );
  }

  const uploadedImages = [];

  try {
    if (hasNewImages) {
      for (const image of projectImages) {
        const publicId = `${Date.now()}-${image.originalname
          .split(".")[0]
          .replace(/\s+/g, "-")
          .toLowerCase()}`;

        const uploadedImage = await uploadBufferToCloudinary({
          buffer: image.buffer,
          folder: process.env.CLOUDINARY_PROJECT_FOLDER || "omseva/projects",
          publicId,
        });

        uploadedImages.push({
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        });
      }
    }

    Object.assign(existingProject, projectUpdateDetails);

    if (hasNewImages || imagesToRemove.length > 0) {
      existingProject.images = [...keptImages, ...uploadedImages];
    }

    const updatedProject = await existingProject.save();

    if (imagesToRemove.length > 0) {
      await Promise.allSettled(
        imagesToRemove.map((image) => deleteFromCloudinary(image.publicId))
      );
    }

    return {
      success: true,
      message: "Project updated successfully",
      data: {
        projectId: updatedProject._id,
        title: updatedProject.title,
        category: updatedProject.category,
        status: updatedProject.status,
        location: updatedProject.location,
        client: updatedProject.client,
        description: updatedProject.description,
        budget: updatedProject.budget,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate,
        teamLeader: updatedProject.teamLeader,
        isFeatured: updatedProject.isFeatured,
        isLive: updatedProject.isLive,
        images: updatedProject.images,
      },
    };
  } catch (error) {
    if (uploadedImages.length > 0) {
      await Promise.allSettled(
        uploadedImages.map((image) => deleteFromCloudinary(image.publicId))
      );
    }

    throw new AppError({
      httpStatusCode: error.httpStatusCode || 500,
      message: error.message || "Project update failed",
      error,
    });
  }
};

export const deleteProjectByIdService = async (projectId) => {
  const existingProject = await ProjectRepo.findProjectById(projectId);

  if (!existingProject) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Project not found",
      error: new Error("Project not found"),
    });
  }

  const cloudinaryDeleteResults = await Promise.allSettled(
    existingProject.images.map((image) => deleteFromCloudinary(image.publicId))
  );

  const failedCloudinaryDeletes = cloudinaryDeleteResults.filter(
    (result) => result.status === "rejected"
  );

  if (failedCloudinaryDeletes.length > 0) {
    throw new AppError({
      httpStatusCode: 502,
      message: "Project images deletion failed",
      error: new Error("Cloudinary image deletion failed"),
    });
  }

  const deletedProject = await ProjectRepo.deleteProjectById(projectId);

  if (!deletedProject) {
    throw new AppError({
      httpStatusCode: 500,
      message: "Project deletion failed",
      error: new Error("Project deletion failed"),
    });
  }

  return {
    success: true,
    message: "Project deleted successfully",
    data: {
      projectId: deletedProject._id,
      deletedImages: existingProject.images.length,
    },
  };
};

export const getFeaturedProjectsListService = async () => {
  const projects = await ProjectRepo.getAllFeaturedProjects();

  return {
    success: true,
    message: "Featured projects fetched successfully",
    data: { projects },
  };
};

export const getNonFeaturedProjectsListService = async () => {
  const projects = await ProjectRepo.getAllNonFeaturedProjectsList();

  return {
    success: true,
    message: "Projects fetched successfully",
    data: { projects },
  };
};
