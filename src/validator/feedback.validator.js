import z from "zod";

import * as AppValidator from "./../validator/app.validator.js";

export const createFeedbackRequestSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(1, "Full name is required"),
    phoneNumber: z.string().trim().min(1, "Phone number is required"),
    emailAddress: z.string().trim().email("Invalid email address"),
    organisationName: z.string().trim().optional(),
    enquiryType: z.string().trim().optional(),
    preferredContactTime: z.string().trim().optional(),
    description: z.string().trim().min(1, "Description is required"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const getAllFeedbackRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
  headers: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const markFeedbackAsReadRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    feedbackId: AppValidator.idSchema,
  }),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});
