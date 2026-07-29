import AppError from "./AppError.utils.js";

const DUPLICATE_KEY_FIELD_MESSAGES = {
  email: "Email is already in use",
  slug: "Employee member slug is already in use",
  userId: "Session already exists for this user",
};

const getDuplicateKeyMessage = (error, overrideMessage) => {
  if (overrideMessage) return overrideMessage;

  const field = Object.keys(error.keyPattern || {})[0];
  return DUPLICATE_KEY_FIELD_MESSAGES[field] || "Resource already exists";
};

export const handleMongoError = (error, options = {}) => {
  if (error.code === 11000) {
    const message = getDuplicateKeyMessage(error, options.duplicateKeyMessage);

    throw new AppError({
      httpStatusCode: 409,
      message,
      error: new Error(message),
    });
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");

    throw new AppError({
      httpStatusCode: 400,
      message: message || "Validation failed",
      error,
    });
  }

  if (error.name === "CastError") {
    throw new AppError({
      httpStatusCode: 400,
      message: "Invalid identifier format",
      error,
    });
  }

  throw error;
};

export const withMongoErrorHandling = (fn, options = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleMongoError(error, options);
    }
  };
};
