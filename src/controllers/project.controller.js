import * as ProjectService from "./../services/project.service.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";

export const createProjectController = async (req, res) => {
  const projectDetails = req.validated.body;

  const projectImages = Array.isArray(req.files) ? req.files : [];

  const result = await ProjectService.createProjectService(
    projectDetails,
    projectImages
  );

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: result.message,
      data: result.data,
    })
  );
};

export const getAllProjectsController = async (req, res) => {
  const result = await ProjectService.getAllProjectsService(
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

export const getAllFeaturedProjectsController = async (req, res) => {
  const result = await ProjectService.getAllFeaturedProjectsService(
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

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.validated.params;

  const result = await ProjectService.getProjectByIdService(projectId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const updateProjectByIdController = async (req, res) => {
  const { projectId } = req.validated.params;

  const updateDetails = req.validated.body;

  const projectImages = Array.isArray(req.files) ? req.files : [];

  const result = await ProjectService.updateProjectByIdService({
    projectId,
    updateDetails,
    projectImages,
  });

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const deleteProjectByIdController = async (req, res) => {
  const { projectId } = req.validated.params;

  const result = await ProjectService.deleteProjectByIdService(projectId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const getFeaturedProjectsListController = async (req, res) => {
  const result = await ProjectService.getFeaturedProjectsListService();

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const getNonFeaturedProjectsListController = async (req, res) => {
  const result = await ProjectService.getNonFeaturedProjectsListService();

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
