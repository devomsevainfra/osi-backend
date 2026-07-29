import Feedback from "./../models/feedback.model.js";
import { withMongoErrorHandling } from "../utils/mongoError.utils.js";

export const createFeedback = withMongoErrorHandling(
  async (feedbackDetails) => {
    return await Feedback.create(feedbackDetails);
  }
);

export const getAllFeedbackPaginated = withMongoErrorHandling(
  async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [responses, totalResponses] = await Promise.all([
      Feedback.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select({ __v: 0 }),

      Feedback.countDocuments({}),
    ]);

    return { responses, totalResponses };
  }
);

export const markFeedbackAsReadById = withMongoErrorHandling(
  async (feedbackId) => {
    return await Feedback.findByIdAndUpdate(
      feedbackId,
      { $set: { isRead: true } },
      { new: true, runValidators: true }
    ).select({ __v: 0 });
  }
);
