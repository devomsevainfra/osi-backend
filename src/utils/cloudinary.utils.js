import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.config.js";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const isRetryableCloudinaryError = (error) => {
  const retryableErrorCodes = [
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "ENETUNREACH",
    "EAI_AGAIN",
  ];

  if (retryableErrorCodes.includes(error?.code)) {
    return true;
  }

  if (Array.isArray(error?.errors)) {
    return error.errors.some((nestedError) =>
      retryableErrorCodes.includes(nestedError?.code)
    );
  }

  const httpCode = error?.http_code || error?.statusCode;

  if (httpCode === 429) {
    return true;
  }

  if (httpCode >= 500 && httpCode <= 599) {
    return true;
  }

  return false;
};

const withRetry = async ({
  task,
  retries = 3,
  delay = 1000,
  operationName = "Cloudinary operation",
}) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      const shouldRetry = isRetryableCloudinaryError(error);

      console.error(`${operationName} failed`, {
        attempt,
        retries,
        code: error?.code,
        httpCode: error?.http_code || error?.statusCode,
        message: error?.message,
      });

      if (!shouldRetry || attempt === retries) {
        throw error;
      }

      await sleep(delay * attempt);
    }
  }

  throw lastError;
};

const uploadBufferOnce = async ({
  buffer,
  folder,
  publicId,
  resourceType = "image",
}) => {
  if (!buffer) {
    throw new Error("File buffer is required for Cloudinary upload");
  }

  if (!folder) {
    throw new Error("Cloudinary folder is required");
  }

  if (!publicId) {
    throw new Error("Cloudinary publicId is required");
  }

  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const uploadBufferToCloudinary = async ({
  buffer,
  folder,
  publicId,
  resourceType = "image",
  retries = 3,
}) => {
  return await withRetry({
    retries,
    delay: 1000,
    operationName: "Cloudinary upload",
    task: async () => {
      return await uploadBufferOnce({
        buffer,
        folder,
        publicId,
        resourceType,
      });
    },
  });
};

const deleteFromCloudinaryOnce = async ({
  publicId,
  resourceType = "image",
}) => {
  if (!publicId) {
    throw new Error("Cloudinary publicId is required for delete");
  }

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

export const deleteFromCloudinary = async (input, retries = 3) => {
  const deletePayload =
    typeof input === "string"
      ? {
          publicId: input,
          resourceType: "image",
        }
      : {
          publicId: input.publicId,
          resourceType: input.resourceType || "image",
        };

  return await withRetry({
    retries,
    delay: 1000,
    operationName: "Cloudinary delete",
    task: async () => {
      return await deleteFromCloudinaryOnce(deletePayload);
    },
  });
};
