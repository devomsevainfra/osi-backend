import express from "express";
import multer from "multer";
import path from "node:path";
import z from "zod";

import asyncHandler from "./../utils/asyncHandler.utils.js";
import validate from "./../middlewares/validate.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import authorize from "./../middlewares/authorization.middleware.js";
import AppError from "./../utils/AppError.utils.js";
import * as Token from "./../utils/token.utils.js";
import Session from "./../models/session.model.js";
import * as BlogController from "./../controllers/blog.controller.js";

const blogRouter = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(extension)
    ) {
      return callback(null, true);
    }

    return callback(
      new AppError({
        httpStatusCode: 400,
        message: "Only JPEG, PNG, and WebP images are allowed",
        error: new Error("Invalid image file type"),
      }),
      false
    );
  },
}).single("image");

const optionalAuthenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return next();

    const accessTokenResult = Token.verifyToken({
      value: accessToken,
      type: "ACCESS_TOKEN",
    });

    if (accessTokenResult.status === "VALID") {
      const { userId, sessionId, role } = accessTokenResult.decoded;
      req.authenticatedUser = { userId, sessionId, role };
      return next();
    }

    if (accessTokenResult.status === "EXPIRED") {
      const { sessionId } = accessTokenResult.decoded;
      const existingSession = await Session.findById(sessionId);

      if (!existingSession) return next();

      const refreshTokenResult = Token.verifyToken({
        value: existingSession.refreshToken,
        type: "REFRESH_TOKEN",
      });

      if (refreshTokenResult.status === "VALID") {
        const { role } = accessTokenResult.decoded;
        const newAccessToken = Token.createAccessToken({
          userId: existingSession.userId,
          sessionId: existingSession._id,
          role,
        });

        res.cookie("accessToken", newAccessToken, {
          maxAge: 1000 * 60 * 60 * 24,
        });
        req.authenticatedUser = {
          userId: existingSession.userId,
          sessionId: existingSession._id,
          role,
        };
      }
    }

    return next();
  } catch {
    return next();
  }
};

const booleanFromFormData = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === undefined || value === "") return undefined;
  return value;
}, z.boolean().optional());

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150),
    content: z
      .string()
      .refine((value) => value.trim().length > 0, "Content is required"),
    slug: z.string().trim().min(1).optional(),
    status: z.enum(["draft", "published"]).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

const getBlogsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
  cookies: z.object({}).optional(),
});

const getBlogBySlugSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    slug: z.string().trim().min(1),
  }),
  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150).optional(),
    content: z
      .string()
      .refine((value) => value.trim().length > 0, "Content is required")
      .optional(),
    status: z.enum(["draft", "published"]).optional(),
    removeImage: booleanFromFormData,
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid blog id"),
  }),
  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

const deleteBlogSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid blog id"),
  }),
  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

blogRouter.post(
  "/",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN")),
  imageUpload,
  validate(createBlogSchema),
  asyncHandler(BlogController.createBlogController)
);

blogRouter.get(
  "/",
  asyncHandler(optionalAuthenticate),
  validate(getBlogsSchema),
  asyncHandler(BlogController.getBlogsController)
);

blogRouter.get(
  "/:slug",
  asyncHandler(optionalAuthenticate),
  validate(getBlogBySlugSchema),
  asyncHandler(BlogController.getBlogBySlugController)
);

blogRouter.put(
  "/:id",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN")),
  imageUpload,
  validate(updateBlogSchema),
  asyncHandler(BlogController.updateBlogController)
);

blogRouter.delete(
  "/:id",
  asyncHandler(authenticate),
  asyncHandler(authorize("ADMIN")),
  validate(deleteBlogSchema),
  asyncHandler(BlogController.deleteBlogController)
);

export default blogRouter;
