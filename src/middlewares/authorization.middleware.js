import AppError from "../utils/AppError.utils.js";
import { ROLES } from "../constants/roles.constants.js";

const forbidden = () =>
  new AppError({
    httpStatusCode: 403,
    message: "You do not have permission to perform this action",
    error: new Error("Authorization denied"),
  });

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const currentUserRole = req.authenticatedUser?.role;

    if (!currentUserRole) {
      return next(forbidden());
    }

    // SUPERADMIN can administer every module, including user management.
    if (currentUserRole === ROLES.SUPERADMIN) {
      return next();
    }

    // ADMIN is deliberately not a global bypass. It has access only to
    // business-module routes that explicitly include ROLES.ADMIN. User
    // management routes include only ROLES.SUPERADMIN.
    if (allowedRoles.includes(currentUserRole)) {
      return next();
    }

    return next(forbidden());
  };
};

export default authorize;
