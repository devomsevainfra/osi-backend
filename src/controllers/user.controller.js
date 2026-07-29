import AppError from "../utils/AppError.utils.js";
import * as AppConstants from "./../constants/app.constants.js";
import * as UserService from "./../services/user.service.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";

export const loginUserController = async (req, res) => {
  const userDetails = {
    email: req.validated.body.email,
    password: req.validated.body.password,
  };

  const loggedInUser = await UserService.loginUserService(userDetails);

  return res
    .status(200)
    .cookie(
      "accessToken",
      loggedInUser.accessToken,
      AppConstants.COOKIE_OPTIONS
    )
    .json(
      new ApiResponse({
        httpStatusCode: 200,
        message: "User login successful",
        data: loggedInUser,
      })
    );
};

export const logoutUserController = async (req, res) => {
  const result = await UserService.logoutUserService(req.authenticatedUser);

  console.log(result);

  if (result.success) {
    return res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: AppConstants.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json(
        new ApiResponse({
          httpStatusCode: 200,
          message: result.message,
          data: result.data,
        })
      );
  } else {
    throw new AppError({
      httpStatusCode: 500,
      message: result.message,
      error: new Error("Logout failed"),
    });
  }
};

export const createUserController = async (req, res) => {
  const userDetails = {
    email: req.validated.body.email,
    password: req.validated.body.password,
    role: req.validated.body.role,
    isActive: req.validated.body.isActive,
  };

  const createdUser = await UserService.createUserService(userDetails);

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: "User Creation Successful!",
      data: createdUser.data,
    })
  );
};

export const getAllUsersController = async (req, res) => {
  const users = await UserService.getAllUserService();
  console.log(users);
  if (users.success) {
    return res.json(
      new ApiResponse({
        httpStatusCode: 200,
        message: "All Users fetched",
        data: users,
      })
    );
  } else {
    return res.json(
      new ApiResponse({
        httpStatusCode: 204,
        message: "No user found",
        data: users,
      })
    );
  }
};

export const deleteUserController = async (req, res) => {
  const deleteUserId = req.validated.body.deleteUserId;

  const deleted = await UserService.deleteUserService(deleteUserId);

  return res.status(200).json(deleted);
};

export const changeEmailController = async (req, res) => {
  const { email, userId } = req.validated.body;
  const result = await UserService.changeEmailService(email, userId);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const changePasswordController = async (req, res) => {
  const { password, userId } = req.validated.body;
  const result = await UserService.changePasswordService(password, userId);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const getUserByIdController = async (req, res) => {
  const { userId } = req.validated.body;
  const result = await UserService.getUserByIdService(userId);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const changeRoleController = async (req, res) => {
  const { userId, role } = req.validated.body;
  const result = await UserService.changeRoleService(userId, role);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const toggleUserStatusController = async (req, res) => {
  const { userId, isActive } = req.validated.body;
  const result = await UserService.toggleUserStatusService(userId, isActive);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const changeMyPasswordController = async (req, res) => {
  const userId = req.authenticatedUser.userId;
  const { password } = req.validated.body;
  const result = await UserService.changeMyPasswordService(userId, password);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const changeMyEmailController = async (req, res) => {
  const userId = req.authenticatedUser.userId;
  const { email } = req.validated.body;
  const result = await UserService.changeEmailByUserService(userId, email);
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
