import { z } from "zod";

const booleanFromFormData = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

const arrayFromFormData = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) return parsed;
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return value;
  },
  z.array(z.string().trim().min(1))
);

const optionalBooleanFromFormData = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === undefined || value === "") return undefined;
  return value;
}, z.boolean().optional());

const optionalArrayFromFormData = z.preprocess(
  (value) => {
    if (value === undefined) return undefined;

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) return parsed;
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

export const createTeamMemberRequestSchema = z.object({
  body: z.object({
    slug: z.string().trim().min(1),
    name: z.string().trim().min(1),
    designation: z.string().trim().min(1),
    qualification: z.string().trim().min(1),
    specializations: arrayFromFormData,
    experience: z.string().trim().min(1),
    keyProjects: arrayFromFormData,
    location: z.string().trim().min(1),
    email: z.string().email().trim().toLowerCase(),
    phone: z.string().trim().min(10),
    isLeader: booleanFromFormData.default(false),
    isLive: booleanFromFormData.default(true),
  }),

  query: z.object({}).optional(),
  params: z.object({}).optional(),
  cookies: z.object({}).optional(),
});

export const editTeamMemberRequestSchema = z.object({
  body: z.object({
    slug: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    designation: z.string().trim().min(1).optional(),
    qualification: z.string().trim().min(1).optional(),
    specializations: optionalArrayFromFormData,
    experience: z.string().trim().min(1).optional(),
    keyProjects: optionalArrayFromFormData,
    location: z.string().trim().min(1).optional(),
    email: z.string().email().trim().toLowerCase().optional(),
    phone: z.string().trim().min(10).optional(),
    isLeader: optionalBooleanFromFormData,
    isLive: optionalBooleanFromFormData,
  }),

  params: z.object({
    teamMemberId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid employee member id"),
  }),
  query: z.object({}).optional(),
  cookies: z.object({}).optional(),
});
