import { ZodError } from "zod";
import Logger from "../utils/Logger.utils.js";
import AppError from "./../utils/AppError.utils.js";
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const input = {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        cookies: req.cookies || {},
      };
      const parsed = await schema.parseAsync(input);
      req.validated = parsed;
      next();
    } catch (err) {
      console.log(err);
      err.httpStatusCode = 400;
      err.message = "Validation Failed";
      next(err);
    }
  };
};
export default validate;
