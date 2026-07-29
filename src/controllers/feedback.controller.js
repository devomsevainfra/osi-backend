import * as FeedbackService from "./../services/feedback.service.js";
import ApiResponse from "./../utils/ApiResponse.utils.js";

export const createFeedbackController = async (req, res) => {
  const feedbackDetails = req.validated.body;

  const result = await FeedbackService.createFeedbackService(feedbackDetails);

  return res.status(201).json(
    new ApiResponse({
      httpStatusCode: 201,
      message: result.message,
      data: result.data,
    })
  );
};

export const getAllFeedbackController = async (req, res) => {
  const result = await FeedbackService.getAllFeedbackService(
    req.validated.query
  );

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};

export const markFeedbackAsReadController = async (req, res) => {
  const { feedbackId } = req.validated.params;

  const result = await FeedbackService.markFeedbackAsReadService(feedbackId);

  return res.status(200).json(
    new ApiResponse({
      httpStatusCode: 200,
      message: result.message,
      data: result.data,
    })
  );
};
