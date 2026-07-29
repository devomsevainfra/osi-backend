import * as SessionRepo from "../repositories/session.repository.js";
import * as UserRepo from "../repositories/user.repository.js";
import AppError from "../utils/AppError.utils.js";
import * as Tokens from "../utils/token.utils.js";

export const loginUserService = async (userDetails) => {
  const existingUser = await UserRepo.findUserByEmail(userDetails.email);

  if (!existingUser) {
    throw new AppError({
      httpStatusCode: 401,
      message: "Invalid email or password",
      error: new Error("Invalid email or password"),
    });
  }

  if (!existingUser.isActive) {
    throw new AppError({
      httpStatusCode: 403,
      message: "User account is inactive",
      error: new Error("User account is inactive"),
    });
  }
  const isPasswordMatching = await existingUser.matchPassword(
    userDetails.password
  );

  if (!isPasswordMatching) {
    throw new AppError({
      httpStatusCode: 401,
      message: "Invalid email or password",
      error: new Error("Invalid email or password"),
    });
  }

  await SessionRepo.deleteSessionsByUserId(existingUser._id);

  const refreshToken = Tokens.createRefreshToken({
    userId: existingUser._id,
    role: existingUser.role,
  });

  const newSession = await SessionRepo.createSession({
    userId: existingUser._id,
    refreshToken,
  });

  const accessToken = Tokens.createAccessToken({
    userId: existingUser._id,
    role: existingUser.role,
    sessionId: newSession._id,
  });

  return {
    userId: existingUser._id,
    sessionId: newSession._id,
    role: existingUser.role,
    accessToken,
  };
};

export const logoutUserService = async (userDetails) => {
  await SessionRepo.deleteSession(userDetails.sessionId);

  return {
    success: true,
    message: "User logged out successfully",
    data: {
      userId: userDetails.userId,
      sessionId: userDetails.sessionId,
    },
  };
};

export const createUserService = async (userDetails) => {
  const user = {
    email: userDetails.email,
    password: userDetails.password,
    role: userDetails.role,
    isActive: userDetails.isActive,
  };

  const savedUser = await UserRepo.createUser(user);

  return {
    success: true,
    data: {
      userId: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      isActive: savedUser.isActive,
    },
  };
};

export const getAllUserService = async () => {
  const users = await UserRepo.findAllUsers();

  if (users.length > 0) {
    return {
      success: true,
      data: users,
    };
  } else {
    return {
      success: false,
      data: null,
    };
  }
};

export const deleteUserService = async (userId) => {
  const existingUser = await UserRepo.findUserById(userId);

  console.log(existingUser);

  if (!existingUser) {
    throw new AppError({
      httpStatusCode: 404,
      message: "User not found",
      error: new Error("User not found"),
    });
  }

  if (existingUser.role === "SUPERADMIN") {
    throw new AppError({
      httpStatusCode: 500,
      message: "User deletion failed",
      error: new Error("Super Admin User deletion prevented"),
    });
  }

  const existingSession = await SessionRepo.deleteSessionsByUserId(userId);

  const deleted = await UserRepo.deleteUserById(userId);

  if (!deleted) {
    throw new AppError({
      httpStatusCode: 500,
      message: "User deletion failed",
      error: new Error("User deletion failed"),
    });
  }

  return {
    success: true,
    message: "User deleted successfully",
    data: {
      userId: deleted._id,
    },
  };
};

export const changeEmailService = async (email, userId) => {
  const existingUser = await UserRepo.findUserByEmail(email);

  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    throw new AppError({
      httpStatusCode: 409,
      message: "Email is already in use",
      error: new Error("Email is already in use"),
    });
  }

  await UserRepo.updateUserEmail(email, userId);
  return {
    success: true,
    message: "Email updated successfully",
    data: { userId, email },
  };
};

export const changePasswordService = async (password, userId) => {
  const user = await UserRepo.findUserById(userId);

  if (!user) {
    throw new AppError({
      httpStatusCode: 404,
      message: "User not found",
      error: new Error("User not found"),
    });
  }

  user.password = password;
  const result = await user.save();

  return {
    success: true,
    message: "Password updated successfully",
    data: { userId: result._id },
  };
};
export const resetUserPassword = async (newPassword, userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;
  const result = await user.save();

  return {
    success: true,
    message: "User password updated successfully",
    data: {
      userId: result._id,
    },
  };
};

export const getUserByIdService = async (userId) => {
  const user = await UserRepo.findUserById(userId);

  if (!user) {
    throw new AppError({
      httpStatusCode: 404,
      message: "User not found",
      error: new Error("User not found"),
    });
  }

  return {
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  };
};

export const changeRoleService = async (userId, role) => {
  const user = await UserRepo.findUserById(userId);

  if (!user) {
    throw new AppError({
      httpStatusCode: 404,
      message: "User not found",
      error: new Error("User not found"),
    });
  }

  if (user.role === "SUPERADMIN") {
    throw new AppError({
      httpStatusCode: 403,
      message: "Cannot change role of SUPERADMIN",
      error: new Error("Cannot change role of SUPERADMIN"),
    });
  }

  const result = await UserRepo.updateUserRole(userId, role);

  return {
    success: true,
    message: "User role updated successfully",
    data: {
      userId: result._id,
      email: result.email,
      role: result.role,
    },
  };
};

export const toggleUserStatusService = async (userId, isActive) => {
  const user = await UserRepo.findUserById(userId);

  if (!user) {
    throw new AppError({
      httpStatusCode: 404,
      message: "User not found",
      error: new Error("User not found"),
    });
  }

  if (user.role === "SUPERADMIN") {
    throw new AppError({
      httpStatusCode: 403,
      message: "Cannot change status of SUPERADMIN",
      error: new Error("Cannot change status of SUPERADMIN"),
    });
  }

  const result = await UserRepo.updateUserStatus(userId, isActive);

  return {
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    data: {
      userId: result._id,
      email: result.email,
      isActive: result.isActive,
    },
  };
};

export const changeMyPasswordService = async (userId, password) => {
  const user = await UserRepo.findUserById(userId);

  if (!user) {
    throw new AppError({
      httpStatusCode: 404,
      message: "User not found",
      error: new Error("User not found"),
    });
  }

  user.password = password;
  const result = await user.save();

  return {
    success: true,
    message: "Password updated successfully",
    data: { userId: result._id },
  };
};

export const changeEmailByUserService = async (userId, email) => {
  const existingUser = await UserRepo.findUserByEmail(email);

  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    throw new AppError({
      httpStatusCode: 409,
      message: "Email is already in use",
      error: new Error("Email is already in use"),
    });
  }

  await UserRepo.updateUserEmail(email, userId);

  return {
    success: true,
    message: "Email updated successfully",
    data: { userId, email },
  };
};
