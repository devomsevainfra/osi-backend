import z from "zod";
import * as AppValidator from "./../validator/app.validator.js";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const jobBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  department: z.string().trim().min(1, "Department is required"),
  location: z.string().trim().min(1, "Location is required"),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  experienceLevel: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required"),
  applicationDeadline: z.coerce.date().optional(),
  isLive: z.boolean().default(true),
});

export const createJobRequestSchema = z.object({
  body: jobBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const updateJobRequestSchema = z.object({
  body: jobBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  }),
  params: z.object({
    jobId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const deleteJobRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    jobId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const getJobsRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    department: z.string().trim().optional(),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    location: z.string().trim().optional(),
    search: z.string().trim().optional(),
    isLive: z.coerce.boolean().optional(), // only honored for authenticated admin/recruiter
  }),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getJobByIdRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    jobId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});
