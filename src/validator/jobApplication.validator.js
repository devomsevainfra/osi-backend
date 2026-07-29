import z from "zod";
import * as AppValidator from "./../validator/app.validator.js";

const APPLICATION_STATUS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
];

export const createJobApplicationRequestSchema = z.object({
  body: z.object({
    jobId: AppValidator.idSchema,
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Invalid email address"),
    phoneNumber: z.string().trim().min(1, "Phone number is required"),
    currentLocation: z.string().trim().optional(),
    currentOrganisation: z.string().trim().optional(),
    experienceYears: z.coerce.number().min(0).optional(),
    coverLetter: z.string().trim().optional(),
    resumeLink: z.string().trim().url("Resume link must be a valid URL"),
    portfolioLink: z
      .string()
      .trim()
      .url("Portfolio link must be a valid URL")
      .optional(),
    otherDocumentLinks: z
      .array(z.string().trim().url("Each document link must be a valid URL"))
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getJobApplicationsRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    jobId: AppValidator.idSchema.optional(),
    status: z.enum(APPLICATION_STATUS).optional(),
    isRead: z.coerce.boolean().optional(),
    minExperience: z.coerce.number().min(0).optional(),
    maxExperience: z.coerce.number().min(0).optional(),
    search: z.string().trim().optional(),
  }),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const getJobApplicationByIdRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    applicationId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const markJobApplicationAsReadRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    applicationId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const updateJobApplicationStatusRequestSchema = z.object({
  body: z.object({
    status: z.enum(APPLICATION_STATUS),
  }),
  params: z.object({
    applicationId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const deleteJobApplicationRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    applicationId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});
