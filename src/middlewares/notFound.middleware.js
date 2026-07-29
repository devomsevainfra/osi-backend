import AppError from "../utils/AppError.utils.js";

const notFoundHandler = (req, res, next) => {
  next(
    new AppError({
      error: new Error("Route not found"),
      httpStatusCode: 404,
      message: "Route not found",
    })
  );
};

export default notFoundHandler;
