import jwt from "jsonwebtoken";

export const createRefreshToken = (userDetails) => {
  return jwt.sign(
    {
      userId: userDetails.userId,
      role: userDetails.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const createAccessToken = (userDetails) => {
  return jwt.sign(
    {
      userId: userDetails.userId,
      sessionId: userDetails.sessionId,
      role: userDetails.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const verifyToken = ({ value, type }) => {
  const tokenSecret =
    type === "ACCESS_TOKEN"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(value, tokenSecret);
    return { status: "VALID", decoded };
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      const decoded = jwt.decode(value);
      return { status: "EXPIRED", decoded };
    } else if (e.name === "JsonWebTokenError") {
      return { status: "INVALID", decoded: null };
    } else {
      console.error("JsonWebToken throws error", e);
      return { status: "INTERNAL_SERVER_ERROR", decoded: null };
    }
  }
};
