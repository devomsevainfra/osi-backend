import Blog from "./../models/blog.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createBlog = withMongoErrorHandling(
  async (blogDetails) => {
    return await Blog.create(blogDetails);
  },
  { duplicateKeyMessage: "Blog slug is already in use" }
);

export const getBlogsPaginated = withMongoErrorHandling(
  async ({ filter = {}, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select({ __v: 0 }),
      Blog.countDocuments(filter),
    ]);

    return { blogs, totalBlogs };
  }
);

export const getBlogBySlug = withMongoErrorHandling(async (slug) => {
  return await Blog.findOne({ slug }).select({ __v: 0 });
});

export const findBlogById = withMongoErrorHandling(async (blogId) => {
  return await Blog.findById(blogId);
});

export const saveBlog = withMongoErrorHandling(
  async (blog) => {
    return await blog.save();
  },
  { duplicateKeyMessage: "Blog slug is already in use" }
);

export const deleteBlogById = withMongoErrorHandling(async (blogId) => {
  return await Blog.findByIdAndDelete(blogId);
});
