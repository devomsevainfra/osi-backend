import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Construction",
        "Transportation",
        "Structural",
        "Water",
        "Surveying",
      ],
      required: true,
      default: "Construction",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Finished"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isLive: {
      type: Boolean,
      default: true,
    },
    teamLeader: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
