import z from "zod";
import * as AppValidator from "./../validator/app.validator.js";
import { getFeaturedProjectValidationErrors } from "../utils/projectFeatured.validation.js";

const CATEGORIES = [
  "Construction",
  "Transportation",
  "Structural",
  "Water",
  "Surveying",
];

const PROJECT_STATUS = ["Upcoming", "Ongoing", "Finished"];

const projectBodySchema = z.object({
  title: z.string().min(5).max(200).trim(),
  category: z.enum(CATEGORIES).default("Construction"),
  status: z.enum(PROJECT_STATUS),
  location: z.string().min(5).max(200).trim(),
  client: z.string().min(5).max(200).trim(),
  description: z.string().min(50).max(2000).trim(),
  budget: z.string().min(5).max(20).trim(),
  teamLeader: z.string().min(2).max(100).trim(),
  startDate: AppValidator.dateStringSchema.optional(),
  endDate: AppValidator.dateStringSchema.optional(),
  images: z.array(z.string().url()).min(1).max(1),
  isFeatured: z.boolean().default(false),
  isLive: z.boolean().default(true),
});

export const updateProjectRequestSchema = z.object({
  body: projectBodySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
  params: z.object({
    projectId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken.optional(),
  }).optional(),
});

export const deleteProjectRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    projectId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken.optional(),
  }).optional(),
});

const booleanFromFormData = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

export const createProjectRequestSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, "Title is required"),

      category: z
        .enum([
          "Construction",
          "Transportation",
          "Structural",
          "Water",
          "Surveying",
        ])
        .default("Construction"),

      status: z.enum(["Upcoming", "Ongoing", "Finished"]),
      location: z.string().trim().min(1, "Location is required"),
      client: z.string().trim().min(1, "Client is required"),
      description: z.string().trim().min(1, "Description is required"),
      budget: z.string().trim().min(1, "Budget is required"),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      isLive: booleanFromFormData.default(true),
      teamLeader: z.string().trim().min(1, "Employee leader is required"),
      isFeatured: booleanFromFormData.default(false),
    })
    .superRefine((body, ctx) => {
      if (body.isFeatured !== true) return;

      const errors = getFeaturedProjectValidationErrors(body, {
        skipImageValidation: true,
      });

      errors.forEach((message) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
      });
    }),

  query: z.object({}).optional(),
  params: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const deleteProjectByIdRequestSchema = z.object({
  params: z.object({
    projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project id"),
  }),

  body: z.object({}).optional(),
  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

const booleanFromFormDataOptional = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === undefined || value === "") return undefined;

  return value;
}, z.boolean().optional());

const optionalDateFromFormData = z.preprocess((value) => {
  if (value === undefined || value === "") return undefined;

  return value;
}, z.coerce.date().optional());

const optionalStringArrayFromFormData = z.preprocess(
  (value) => {
    if (value === undefined || value === "") return undefined;

    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return value;
  },
  z.array(z.string().trim().min(1)).optional()
);

export const updateProjectByIdRequestSchema = z.object({
  params: z.object({
    projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project id"),
  }),

  body: z.object({
    title: z.string().trim().min(1).optional(),

    category: z
      .enum([
        "Construction",
        "Transportation",
        "Structural",
        "Water",
        "Surveying",
      ])
      .optional(),

    status: z.enum(["Upcoming", "Ongoing", "Finished"]).optional(),

    location: z.string().trim().min(1).optional(),

    client: z.string().trim().min(1).optional(),

    description: z.string().trim().min(1).optional(),

    budget: z.string().trim().min(1).optional(),

    startDate: optionalDateFromFormData,

    endDate: optionalDateFromFormData,

    isLive: booleanFromFormDataOptional,

    teamLeader: z.string().trim().min(1).optional(),

    isFeatured: booleanFromFormDataOptional,

    removeImagePublicIds: optionalStringArrayFromFormData,
  }),

  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getFeaturedProjectsListRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getNonFeaturedProjectsListRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getAllProjectsRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    category: z.enum(CATEGORIES).optional(),
    status: z.enum(PROJECT_STATUS).optional(),
    isFeatured: z.coerce.boolean().optional(),
    isLive: z.coerce.boolean().optional(),
    search: z.string().trim().optional(),
  }),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getAllFeaturedProjectsRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    category: z.enum(CATEGORIES).optional(),
    status: z.enum(PROJECT_STATUS).optional(),
    isLive: z.coerce.boolean().optional(),
    search: z.string().trim().optional(),
  }),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getProjectByIdRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    projectId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});
