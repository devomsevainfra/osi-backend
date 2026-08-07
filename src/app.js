import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import { generalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import appRouter from "./routes/app.router.js";

const app = express();


app.disable("x-powered-by");


if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);

};

const allowedOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

app.use(process.env.API_PREFIX, appRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
