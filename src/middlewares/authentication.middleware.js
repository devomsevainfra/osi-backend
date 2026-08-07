import * as Token from "../utils/token.utils.js";
import Session from "../models/session.model.js";
import AppError from "../utils/AppError.utils.js";

const authenticate = async (req, res, next) => {
  const authorization = req.get("authorization");
  const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const accessToken = req.cookies.accessToken || bearerToken;

  if (!accessToken) {
    console.error("Access token missing");
    return next(
      new AppError({
        httpStatusCode: 401,
        message: "Authentication required",
        error: new Error("Access token missing"),
      })
    );
  }

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
      console.log("Session not found");
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

      res.cookie("accessToken", newAccessToken, process.env.COOKIE_OPTIONS);

      req.authenticatedUser = {
        userId: existingSession.userId,
        sessionId: existingSession._id,
        role,
      };
      console.log("REFRESHED ACCESS TOKEN");
      return next();
    } else {
      await Session.deleteOne({ _id: existingSession._id });
      console.log("DELETED SESSION");
    }
    console.log("REFRESH TOKEN INVALID");
    return next(
      new AppError({
        httpStatusCode: 401,
        message: "Session ended, please login",
        error: new Error("Refresh token invalid"),
      })
    );
  }

  // INVALID or INTERNAL_SERVER_ERROR
  console.log("TOKEN VERIFICATION FAILED");
  return next(
    new AppError({
      httpStatusCode: 401,
      message: "Invalid JWT token",
      error: new Error("Token verification failed"),
    })
  );
};

export default authenticate;
