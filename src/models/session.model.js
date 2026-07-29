import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  refreshToken: {
    type: String,
    required: true,
  },
});

const Session = new mongoose.model("Session", sessionSchema);

export default Session;
