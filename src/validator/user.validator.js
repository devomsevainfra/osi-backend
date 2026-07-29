import z from "zod";
import * as AppValidator from "./../validator/app.validator.js";

export const createUserRequestSchema = z.object({
  body: z.object({
    email: AppValidator.emailSchema,
    password: AppValidator.passwordSchema,
    role: AppValidator.roleSchema,
    isActive: AppValidator.isActiveSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const loginUserRequestSchema = z.object({
  body: z.object({
    email: AppValidator.emailSchema,
    password: AppValidator.passwordSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({}),
});

export const logoutUserRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const deleteUserRequestSchema = z.object({
  body: z
    .object({
      deleteUserId: AppValidator.idSchema,
    })
    .optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const changeEmailRequestSchema = z.object({
  body: z.object({
    email: AppValidator.emailSchema,
    userId: AppValidator.idSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const changePasswordRequestSchema = z.object({
  body: z.object({
    password: AppValidator.passwordSchema,
    userId: AppValidator.idSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({
    accessToken: AppValidator.accessToken,
  }),
});

export const getUserByIdRequestSchema = z.object({
  body: z.object({ userId: AppValidator.idSchema }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({ accessToken: AppValidator.accessToken }),
});

export const changeRoleRequestSchema = z.object({
  body: z.object({
    userId: AppValidator.idSchema,
    role: AppValidator.roleSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({ accessToken: AppValidator.accessToken }),
});

export const toggleUserStatusRequestSchema = z.object({
  body: z.object({
    userId: AppValidator.idSchema,
    isActive: AppValidator.isActiveSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({ accessToken: AppValidator.accessToken }),
});

export const changeMyPasswordRequestSchema = z.object({
  body: z.object({ password: AppValidator.passwordSchema }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({ accessToken: AppValidator.accessToken }),
});

export const changeMyEmailRequestSchema = z.object({
  body: z.object({ email: AppValidator.emailSchema }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
  cookies: z.object({ accessToken: AppValidator.accessToken }),
});
