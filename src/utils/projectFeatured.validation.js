import AppError from "./AppError.utils.js";

const STRING_FIELD_RULES = {
  title: { min: 5, max: 200, label: "Title" },
  location: { min: 5, max: 200, label: "Location" },
  client: { min: 5, max: 200, label: "Client" },
  description: { min: 50, max: 2000, label: "Description" },
  budget: { min: 5, max: 20, label: "Budget" },
  teamLeader: { min: 2, max: 100, label: "Team leader" },
};

const CATEGORIES = [
  "Construction",
  "Transportation",
  "Structural",
  "Water",
  "Surveying",
];

const STATUSES = ["Upcoming", "Ongoing", "Finished"];

const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

export const getFeaturedProjectValidationErrors = (
  project,
  { imageCount = 0, skipImageValidation = false } = {}
) => {
  const errors = [];

  for (const [field, rule] of Object.entries(STRING_FIELD_RULES)) {
    const value = project[field];

    if (isEmptyValue(value)) {
      errors.push(`${rule.label} is required for featured projects`);
      continue;
    }

    const trimmed = String(value).trim();

    if (trimmed.length < rule.min) {
      errors.push(
        `${rule.label} must be at least ${rule.min} characters for featured projects`
      );
    } else if (trimmed.length > rule.max) {
      errors.push(
        `${rule.label} must not exceed ${rule.max} characters for featured projects`
      );
    }
  }

  if (
    isEmptyValue(project.category) ||
    !CATEGORIES.includes(project.category)
  ) {
    errors.push("Category is required for featured projects");
  }

  if (isEmptyValue(project.status) || !STATUSES.includes(project.status)) {
    errors.push("Status is required for featured projects");
  }

  if (!isValidDate(project.startDate)) {
    errors.push("Start date is required for featured projects");
  }

  if (!isValidDate(project.endDate)) {
    errors.push("End date is required for featured projects");
  }

  if (typeof project.isLive !== "boolean") {
    errors.push("Live status is required for featured projects");
  }

  if (!skipImageValidation && imageCount !== 1) {
    errors.push("Featured projects must have exactly 1 image");
  }

  return errors;
};

export const assertFeaturedProjectComplete = (project, options = {}) => {
  const errors = getFeaturedProjectValidationErrors(project, options);

  if (errors.length > 0) {
    throw new AppError({
      httpStatusCode: 400,
      message: errors[0],
      error: new Error(errors.join("; ")),
    });
  }
};
