import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("GUser", userSchema);

export default User;
