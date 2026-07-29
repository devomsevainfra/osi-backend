import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import { generalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import appRouter from "./routes/app.router.js";

import * as AppConstants from "./constants/app.constants.js";

const app = express();

app.disable("x-powered-by");

if (AppConstants.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "upgrade-insecure-requests":
          AppConstants.NODE_ENV === "production" ? [] : null,
      },
    },
    strictTransportSecurity:
      AppConstants.NODE_ENV === "production"
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
  })
);
app.use(
  cors({
    origin: AppConstants.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(generalRateLimiter);
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(cookieParser());
app.use(compression());
app.use(express.static("public"));

app.use("/api/v2", appRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
