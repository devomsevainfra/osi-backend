import Session from "../models/session.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createSession = withMongoErrorHandling(async (sessionDetails) => {
  return await Session.create(sessionDetails);
});

export const findSessionByUserId = withMongoErrorHandling(async (userId) => {
  return await Session.findOne({ userId });
});

export const findSessionById = withMongoErrorHandling(async (sessionId) => {
  return await Session.findById(sessionId);
});

export const deleteSession = withMongoErrorHandling(async (sessionId) => {
  return await Session.deleteOne({ _id: sessionId });
});

export const deleteSessionsByUserId = withMongoErrorHandling(async (userId) => {
  return await Session.deleteMany({ userId });
});
