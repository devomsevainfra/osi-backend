import * as Token from "../utils/token.utils.js";
import Session from "../models/session.model.js";
import AppError from "../utils/AppError.utils.js";

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  // const accessToken = req.validated.cookies.accessToken;

  const accessTokenResult = Token.verifyToken({
    value: accessToken,
    type: "ACCESS_TOKEN",
  });

  if (accessTokenResult.status === "VALID") {
    const { userId, sessionId, role } = accessTokenResult.decoded;
    req.authenticatedUser = { userId, sessionId, role };
    return next();
  }

  if (accessTokenResult.status === "EXPIRED") {
    const { sessionId } = accessTokenResult.decoded;
    const existingSession = await Session.findById(sessionId);

    if (!existingSession) {
      return next(
        new AppError({
          httpStatusCode: 401,
          message: "Session ended, please login",
          error: new Error("Session not found"),
        })
      );
    }

    const refreshTokenResult = Token.verifyToken({
      value: existingSession.refreshToken,
      type: "REFRESH_TOKEN",
    });

    if (refreshTokenResult.status === "VALID") {
      const { userId, role } = accessTokenResult.decoded;
      const newAccessToken = Token.createAccessToken({
        userId: existingSession.userId,
        sessionId: existingSession._id,
        role,
      });

      res.cookie("accessToken", newAccessToken, {
        maxAge: 1000 * 60 * 60 * 24,
      });

      req.authenticatedUser = {
        userId: existingSession.userId,
        sessionId: existingSession._id,
        role,
      };
      console.log("REFRESHED ACCESS TOKEN");

      return next();
    } else {
      imp;
      await Session.deleteOne({ _id: existingSession._id });
    }

    return next(
      new AppError({
        httpStatusCode: 401,
        message: "Session ended, please login",
        error: new Error("Refresh token invalid"),
      })
    );
  }

  // INVALID or INTERNAL_SERVER_ERROR
  return next(
    new AppError({
      httpStatusCode: 401,
      message: "Invalid JWT token",
      error: new Error("Token verification failed"),
    })
  );
};

export default authenticate;
