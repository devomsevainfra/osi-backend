export const APP_NAME = process.env.APP_NAME || "osi_web_backend";
export const CLIENT_NAME = {
  WEB: "osi_web_frontend",
  MOB: "osi_web_mobile",
};
export const DB_NAME = process.env.DB_NAME || "osi_web_db";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGODB_URI = process.env.MONGODB_URI;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

export const COOKIE_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24,
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
};
