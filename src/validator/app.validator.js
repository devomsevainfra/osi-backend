import { maxLength, z } from "zod";

export const nameSchema = z
  .string()
  .min(3)
  .max(100)
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Name can only contain letters, numbers, ., _, and -"
  );

export const emailSchema = z
  .email("Invalid email address")
  .transform((email) => email.trim().toLocaleLowerCase());

export const idSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const tokenSchema = z.string();

export const isActiveSchema = z.boolean();

export const roleSchema = z.enum([
  "SUPERADMIN",
  "ADMIN",
  "ENGINEER",
  "RECRUITER",
  "USER",
]);

export const passwordSchema = z
  .string()
  .min(8)
  .max(32)
  .refine(
    (password) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/.test(
        password
      ),
    {
      message:
        "Password must be 8-32 characters and contain uppercase, lowercase, number, and special character",
    }
  );

export const dateSchema = z
  .string()
  .regex(
    /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/,
    "Date must be in DDMMYYYY format"
  )
  .transform((value) => {
    const day = Number(value.slice(0, 2));
    const month = Number(value.slice(2, 4)) - 1;
    const year = Number(value.slice(4, 8));

    const date = new Date(year, month, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      throw new Error("Invalid date");
    }

    return date;
  });

export const mobileNumberSchema = z
  .string()
  .refine((value) => /^[6-9]\d{9}$/.test(value), {
    message: "Invalid mobile number",
  });

export const urlSchema = z.url({
  message: "Invalid URL",
});

export const accessToken = z.string();

export const dateStringSchema = z
  .string()
  .regex(
    /^\d{2}[-/]\d{2}[-/]\d{4}$/,
    "Date must be in DD-MM-YYYY or DD/MM/YYYY format"
  )
  .transform((val, ctx) => {
    const [day, month, year] = val.split(/[-/]/).map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    const isValid =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day;

    if (!isValid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date" });
      return z.NEVER;
    }
    return date;
  });
