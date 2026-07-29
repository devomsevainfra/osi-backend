import User from "../models/user.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createUser = withMongoErrorHandling(
  async (userDetails) => {
    return await User.create(userDetails);
  },
  { duplicateKeyMessage: "User already exists" }
);

export const findUserByEmail = withMongoErrorHandling(async (email) => {
  return await User.findOne({ email });
});

export const findUserById = withMongoErrorHandling(async (userId) => {
  return await User.findById(userId);
});

export const deleteUserById = withMongoErrorHandling(async (userId) => {
  return await User.findByIdAndDelete(userId);
});

export const findAllUsers = withMongoErrorHandling(async () => {
  return await User.find().select({
    password: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
});

export const updateUserEmail = withMongoErrorHandling(async (email, userId) => {
  await User.updateOne({ _id: userId }, { $set: { email } });
});

export const updateUserRole = withMongoErrorHandling(async (userId, role) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true }
  ).select({ password: 0, __v: 0 });
});

export const updateUserStatus = withMongoErrorHandling(
  async (userId, isActive) => {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { isActive } },
      { new: true }
    ).select({ password: 0, __v: 0 });
  }
);
