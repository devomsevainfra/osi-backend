import * as FeedbackRepo from "./../repositories/feedback.repository.js";

export const createFeedbackService = async (feedbackDetails) => {
  const createdFeedback = await FeedbackRepo.createFeedback(feedbackDetails);

  return {
    success: true,
    message: "Response submitted successfully",
    data: createdFeedback,
  };
};

export const getAllFeedbackService = async ({ page, limit }) => {
  const { responses, totalResponses } =
    await FeedbackRepo.getAllFeedbackPaginated({
      page,
      limit,
    });

  const totalPages = Math.ceil(totalResponses / limit) || 1;

  return {
    success: true,
    message: "Responses fetched successfully",
    data: {
      responses,
      pagination: {
        page,
        limit,
        totalResponses,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

import AppError from "./../utils/AppError.utils.js";

export const markFeedbackAsReadService = async (feedbackId) => {
  const updatedFeedback = await FeedbackRepo.markFeedbackAsReadById(feedbackId);

  if (!updatedFeedback) {
    throw new AppError({
      httpStatusCode: 404,
      message: "Response not found",
      error: new Error("Response not found"),
    });
  }

  return {
    success: true,
    message: "Response marked as read",
    data: updatedFeedback,
  };
};
