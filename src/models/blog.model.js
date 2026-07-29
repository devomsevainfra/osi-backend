import mongoose from "mongoose";

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const blogImageSchema = new mongoose.Schema(
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
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          typeof value === "string" && value.trim().length > 0,
        message: "Content is required",
      },
    },
    image: {
      type: blogImageSchema,
      required: false,
      default: undefined,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

blogSchema.pre("validate", function () {
  if (!this.slug || (this.isModified("title") && !this.isModified("slug"))) {
    this.slug = createSlug(this.title);
  } else if (this.isModified("slug")) {
    this.slug = createSlug(this.slug);
  }
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
