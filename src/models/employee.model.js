import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "raw"],
      required: true,
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    specializations: {
      type: [String],
      required: true,
      default: [],
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    keyProjects: {
      type: [String],
      required: true,
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: fileSchema,
      required: true,
    },

    resume: {
      type: fileSchema,
      required: true,
    },

    isLeader: {
      type: Boolean,
      required: true,
      default: false,
    },

    isLive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", teamSchema);

export default Employee;
