import * as AppConstants from "../constants/app.constants.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
const errorHandler = (err, req, res, next) => {
  console.log(err);

  const httpStatusCode = err.httpStatusCode || 500;
  const error = err.error || err;

  const response = new ApiResponse({
    httpStatusCode,
    message: err.message || "Internal Server Error",
    error,
  });

  return res.status(httpStatusCode).json(response);
};

export default errorHandler;
