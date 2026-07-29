import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import asyncHandler from "./../utils/asyncHandler.utils.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";
import AppError from "../utils/AppError.utils.js";
import * as AppConstants from "../constants/app.constants.js";

const packageJson = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../package.json"),
    "utf-8"
  )
);

const DB_READY_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
};

const getServerHealth = () => {
  const uptimeSeconds = process.uptime();
  const memory = process.memoryUsage();

  const response = {
    name: packageJson.name,
    version: packageJson.version,
    environment: AppConstants.NODE_ENV,
    port: AppConstants.PORT,
    nodeVersion: process.version,
    uptimeSeconds,
    uptime: formatUptime(uptimeSeconds),
    startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external,
    },
  };

  return response;
};

const getDatabaseHealth = async () => {
  const { connection } = mongoose;

  let ping = null;
  if (connection.readyState === 1 && connection.db) {
    try {
      await connection.db.admin().ping();
      ping = "ok";
    } catch {
      ping = "failed";
    }
  }

  return {
    status: DB_READY_STATES[connection.readyState] || "unknown",
    readyState: connection.readyState,
    ping,
    host: connection.host || null,
    port: connection.port || null,
    name: connection.name || null,
  };
};

export const getHealth = asyncHandler(async (req, res) => {
  const server = getServerHealth();
  const database = await getDatabaseHealth();
  const isHealthy = database.status === "connected" && database.ping === "ok";

  const response = {
    httpStatusCode: isHealthy ? 200 : 503,
    message: isHealthy
      ? "Healthy, Healthcheck data fetched"
      : "Unhealthy, Healthcheck data fetched",
    data: {
      server,
      database,
      isHealthy,
    },
  };

  return res.status(response.httpStatusCode).json(new ApiResponse(response));
});

export const getSuccess = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      data: "Hello",
      message: "Request Successful",
    })
  );
});

export const getError = asyncHandler(async (req, res) => {
  const err = new AppError({
    httpStatusCode: 400,
    message: "Request Error",
    error: new Error("This is a error"),
  });

  throw err;
});
