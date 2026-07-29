import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    organisationName: {
      type: String,
      trim: true,
    },
    enquiryType: {
      type: String,
      trim: true,
      default: "Project Consultancy",
    },
    preferredContactTime: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
