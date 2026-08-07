import { Router } from "express";
import asyncHandler from "./../utils/asyncHandler.utils.js";
import validate from "./../middlewares/validate.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import authorize from "./../middlewares/authorization.middleware.js";
import { authRateLimiter } from "./../middlewares/rateLimiter.middleware.js";
import { ROLES } from "./../constants/roles.constants.js";
import * as UserValidator from "./../validator/user.validator.js";
import * as UserController from "./../controllers/user.controller.js";

const userRouter = Router();

userRouter.post(
  "/bootstrapSuperAdmin",
  authRateLimiter,
  asyncHandler(UserController.bootstrapSuperAdminController)
);

userRouter.post(
  "/loginUser",
  authRateLimiter,
  validate(UserValidator.loginUserRequestSchema),
  asyncHandler(UserController.loginUserController)
);

userRouter.post(
  "/logoutUser",
  validate(UserValidator.logoutUserRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(UserController.logoutUserController)
);

userRouter.post(
  "/createUser",
  validate(UserValidator.createUserRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.createUserController)
);

userRouter.get(
  "/getAllUsers",
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.getAllUsersController)
);

userRouter.delete(
  "/deleteUserById",
  validate(UserValidator.deleteUserRequestSchema),
  asyncHandler(authenticate),
  authorize(ROLES.SUPERADMIN),
  asyncHandler(UserController.deleteUserController)
);

userRouter.patch(
  "/changeEmail",
  validate(UserValidator.changeEmailRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.changeEmailController)
);

userRouter.patch(
  "/changePassword",
  validate(UserValidator.changePasswordRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.changePasswordController)
);

userRouter.post(
  "/getUserById",
  validate(UserValidator.getUserByIdRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.getUserByIdController)
);

userRouter.patch(
  "/changeRole",
  validate(UserValidator.changeRoleRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.changeRoleController)
);

userRouter.patch(
  "/toggleUserStatus",
  validate(UserValidator.toggleUserStatusRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(authorize(ROLES.SUPERADMIN)),
  asyncHandler(UserController.toggleUserStatusController)
);

userRouter.patch(
  "/changePasswordByUser",
  validate(UserValidator.changeMyPasswordRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(UserController.changeMyPasswordController)
);

userRouter.patch(
  "/changeEmailIdByUser",
  validate(UserValidator.changeMyEmailRequestSchema),
  asyncHandler(authenticate),
  asyncHandler(UserController.changeMyEmailController)
);

export default userRouter;
