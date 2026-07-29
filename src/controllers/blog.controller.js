import * as BlogService from "./../services/blog.service.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";

export const createBlogController = async (req, res) => {
  const result = await BlogService.createBlogService(
    req.validated.body,
    req.file
  );

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: result.message,
      data: result.data,
    })
  );
};

export const getBlogsController = async (req, res) => {
  const result = await BlogService.getBlogsService({
    ...req.validated.query,
    isAdmin: req.authenticatedUser?.role === "ADMIN",
  });

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const getBlogBySlugController = async (req, res) => {
  const result = await BlogService.getBlogBySlugService({
    slug: req.validated.params.slug,
    isAdmin: req.authenticatedUser?.role === "ADMIN",
  });

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const updateBlogController = async (req, res) => {
  const result = await BlogService.updateBlogService({
    blogId: req.validated.params.id,
    updateDetails: req.validated.body,
    image: req.file,
  });

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const deleteBlogController = async (req, res) => {
  const result = await BlogService.deleteBlogService(req.validated.params.id);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
