import { Router } from "express";
import asyncHandler from "./../utils/asyncHandler.utils.js";
import * as InfoController from "../controllers/info.controller.js";

const appRouter = Router();

appRouter.get("/healthcheck", asyncHandler(InfoController.getHealth));
appRouter.get("/success", asyncHandler(InfoController.getSuccess));
appRouter.get("/error", asyncHandler(InfoController.getError));

export default appRouter;
