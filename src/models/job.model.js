import mongoose from "mongoose";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      required: true,
    },
    experienceLevel: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDeadline: {
      type: Date,
    },
    isLive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
export { EMPLOYMENT_TYPES };
