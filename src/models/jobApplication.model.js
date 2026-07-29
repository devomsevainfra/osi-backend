import mongoose from "mongoose";

const APPLICATION_STATUS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
];

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    currentOrganisation: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      min: 0,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    resumeLink: {
      type: String,
      required: true,
      trim: true,
    },
    portfolioLink: {
      type: String,
      trim: true,
    },
    otherDocumentLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      required: true,
      default: "Applied",
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
export { APPLICATION_STATUS };
