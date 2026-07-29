import AppError from "../utils/AppError.utils.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const currentUserRole = req.authenticatedUser.role;

    const result = allowedRoles.includes(currentUserRole);

    if (result) {
      next();
    } else {
      next(
        new AppError({
          httpStatusCode: 401,
          message: "Unauthorized User",
          error: new Error("Unauthorized User"),
        })
      );
    }
  };
};

export default authorize;
