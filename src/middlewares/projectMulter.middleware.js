import multer from "multer";
import path from "node:path";
import AppError from "../utils/AppError.utils.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/png", "image/jpeg"];

const allowedExtensions = [".png", ".jpg", ".jpeg"];

const imageFileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();

  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
  const isValidExtension = allowedExtensions.includes(fileExtension);

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
};

export const uploadProjectImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
}).array("images", 1);
