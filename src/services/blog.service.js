import * as BlogRepo from "./../repositories/blog.repository.js";
import AppError from "./../utils/AppError.utils.js";
import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "../utils/cloudinary.utils.js";

const uploadBlogImage = async (image) => {
  const publicId = `${Date.now()}-${image.originalname
    .split(".")[0]
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  const uploadedImage = await uploadBufferToCloudinary({
    buffer: image.buffer,
    folder: process.env.CLOUDINARY_BLOG_FOLDER || "omseva/blogs",
    publicId,
  });

  return {
    url: uploadedImage.secure_url,
    publicId: uploadedImage.public_id,
  };
};

export const createBlogService = async (blogDetails, image) => {
  let uploadedImage;

  try {
    if (image) {
      uploadedImage = await uploadBlogImage(image);
    }

    const createdBlog = await BlogRepo.createBlog({
      ...blogDetails,
      ...(uploadedImage ? { image: uploadedImage } : {}),
    });

    return {
      success: true,
      message: "Blog created successfully",
      data: createdBlog,
    };
  } catch (error) {
    if (uploadedImage) {
      await Promise.allSettled([deleteFromCloudinary(uploadedImage.publicId)]);
    }

    if (error instanceof AppError) throw error;

    throw new AppError({
      httpStatusCode: error.httpStatusCode || 500,
      message: error.message || "Blog creation failed",
      error,
    });
  }
};

export const getBlogsService = async ({ page, limit, isAdmin }) => {
  const filter = isAdmin ? {} : { status: "published" };
  const { blogs, totalBlogs } = await BlogRepo.getBlogsPaginated({
    filter,
    page,
    limit,
  });

  const totalPages = Math.ceil(totalBlogs / limit) || 1;

  return {
    success: true,
    message: "Blogs fetched successfully",
    data: {
      blogs,
      pagination: {
        page,
        limit,
        totalBlogs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

export const getBlogBySlugService = async ({ slug, isAdmin }) => {
  const blog = await BlogRepo.getBlogBySlug(slug);

  if (!blog || (blog.status === "draft" && !isAdmin)) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Blog not found",
      error: new Error("Blog not found"),
    });
  }

  return {
    success: true,
    message: "Blog fetched successfully",
    data: blog,
  };
};

export const updateBlogService = async ({ blogId, updateDetails, image }) => {
  const existingBlog = await BlogRepo.findBlogById(blogId);

  if (!existingBlog) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Blog not found",
      error: new Error("Blog not found"),
    });
  }

  const { removeImage, ...blogUpdateDetails } = updateDetails;

  if (image && removeImage) {
    throw new AppError({
      httpStatusCode: 400,
      message: "Image cannot be added and removed in the same request",
      error: new Error("Conflicting image update"),
    });
  }

  if (Object.keys(blogUpdateDetails).length === 0 && !image && !removeImage) {
    throw new AppError({
      httpStatusCode: 400,
      message: "At least one field is required for update",
      error: new Error("Empty update"),
    });
  }

  const oldImage = existingBlog.image?.publicId
    ? existingBlog.image.toObject()
    : null;
  let uploadedImage;

  try {
    if (image) {
      uploadedImage = await uploadBlogImage(image);
    }

    Object.assign(existingBlog, blogUpdateDetails);

    if (uploadedImage) {
      existingBlog.image = uploadedImage;
    } else if (removeImage) {
      existingBlog.image = undefined;
    }

    const updatedBlog = await BlogRepo.saveBlog(existingBlog);

    if ((uploadedImage || removeImage) && oldImage) {
      await Promise.allSettled([deleteFromCloudinary(oldImage.publicId)]);
    }

    return {
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    };
  } catch (error) {
    if (uploadedImage) {
      await Promise.allSettled([deleteFromCloudinary(uploadedImage.publicId)]);
    }

    if (error instanceof AppError) throw error;

    throw new AppError({
      httpStatusCode: error.httpStatusCode || 500,
      message: error.message || "Blog update failed",
      error,
    });
  }
};

export const deleteBlogService = async (blogId) => {
  const existingBlog = await BlogRepo.findBlogById(blogId);

  if (!existingBlog) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Blog not found",
      error: new Error("Blog not found"),
    });
  }

  if (existingBlog.image?.publicId) {
    try {
      await deleteFromCloudinary(existingBlog.image.publicId);
    } catch (error) {
      throw new AppError({
        httpStatusCode: 502,
        message: "Blog image deletion failed",
        error,
      });
    }
  }

  const deletedBlog = await BlogRepo.deleteBlogById(blogId);

  if (!deletedBlog) {
    throw new AppError({
      httpStatusCode: 500,
      message: "Blog deletion failed",
      error: new Error("Blog deletion failed"),
    });
  }

  return {
    success: true,
    message: "Blog deleted successfully",
    data: { blogId: deletedBlog._id },
  };
};
