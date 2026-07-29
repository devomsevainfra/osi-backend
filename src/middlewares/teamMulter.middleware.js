import multer from "multer";
import path from "node:path";
import AppError from "../utils/AppError.utils.js";

const storage = multer.memoryStorage();

const allowedImageMimeTypes = ["image/png", "image/jpeg"];
const allowedImageExtensions = [".png", ".jpg", ".jpeg"];

const allowedResumeMimeTypes = ["application/pdf"];
const allowedResumeExtensions = [".pdf"];

const teamFileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "image") {
    const isValidMimeType = allowedImageMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedImageExtensions.includes(fileExtension);

    if (isValidMimeType && isValidExtension) {
      return cb(null, true);
    }

    return cb(
      new AppError({
        httpStatusCode: 400,
        message: "Only PNG, JPG, and JPEG images are allowed",
        error: new Error("Invalid image file type"),
      }),
      false
    );
  }

  if (file.fieldname === "resume") {
    const isValidMimeType = allowedResumeMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedResumeExtensions.includes(fileExtension);

    if (isValidMimeType && isValidExtension) {
      return cb(null, true);
    }

    return cb(
      new AppError({
        httpStatusCode: 400,
        message: "Only PDF resume files are allowed",
        error: new Error("Invalid resume file type"),
      }),
      false
    );
  }

  return cb(
    new AppError({
      httpStatusCode: 400,
      message: "Invalid file field",
      error: new Error("Invalid file field"),
    }),
    false
  );
};

export const uploadTeamFiles = multer({
  storage,
  fileFilter: teamFileFilter,
  limits: {
    files: 2,
    fileSize: 10 * 1024 * 1024,
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
