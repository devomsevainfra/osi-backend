import { rateLimit } from "express-rate-limit";

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

const getRetryAfterSeconds = (req, windowMs) => {
  const resetTime = req.rateLimit?.resetTime?.getTime();

  if (!resetTime) return Math.ceil(windowMs / 1000);

  return Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
};

const createRateLimitHandler = (message) => {
  return (req, res, _next, options) => {
    const retryAfterSeconds = getRetryAfterSeconds(req, options.windowMs);

    res.set("Retry-After", String(retryAfterSeconds));

    return res.status(options.statusCode).json({
      httpStatusCode: options.statusCode,
      success: false,
      message,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        retryAfterSeconds,
      },
    });
  };
};

const sharedOptions = {
  windowMs: FIFTEEN_MINUTES_IN_MS,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
};

export const generalRateLimiter = rateLimit({
  ...sharedOptions,
  limit: 100,
  identifier: "general-api",
  handler: createRateLimitHandler(
    "Too many requests from this IP. Please try again later."
  ),
});

export const authRateLimiter = rateLimit({
  ...sharedOptions,
  limit: 50,
  identifier: "authentication",
  skipSuccessfulRequests: true,
  handler: createRateLimitHandler(
    "Too many authentication attempts. Please try again later."
  ),
});
