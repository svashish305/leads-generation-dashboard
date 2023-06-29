import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { SALT } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    webhookUrl: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, SALT);
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.userId = count === 0 ? 1 : count + 1;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
