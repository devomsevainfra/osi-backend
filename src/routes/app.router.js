import { Router } from "express";
import infoRouter from "./info.router.js";
import userRouter from "./user.router.js";
import projectRouter from "./project.router.js";
import teamRouter from "./employee.router.js";
import feedbackRouter from "./feedback.route.js";
import jobRouter from "./job.route.js";
import jobApplicationRouter from "./jobApplication.route.js";
import blogRouter from "./blog.routes.js";

const appRouter = Router();

appRouter.use("/info", infoRouter);
appRouter.use("/user", userRouter);
appRouter.use("/project", projectRouter);
appRouter.use("/employee", teamRouter);
appRouter.use("/feedback", feedbackRouter);
appRouter.use("/job", jobRouter);
appRouter.use("/job-applications", jobApplicationRouter);
appRouter.use("/blog", blogRouter);

export default appRouter;
