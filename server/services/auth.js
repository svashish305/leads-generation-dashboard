import User from "../models/user.js";
import { createSecretToken } from "../utils/auth.js";
import bcrypt from "bcryptjs";

export const signup = async (body) => {
  try {
    const { email, password } = body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: { code: 400, message: "User already exists" } };
    }
    let user = new User({ email, password });
    user = await user.save();
    const { userId } = user.toObject();
    const token = createSecretToken(userId);
    return { token, userId };
  } catch (error) {
    console.error("Could not signup user due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};

export const login = async (body) => {
  try {
    const { email, password } = body;
    if (!email || !password) {
      return { error: { code: 400, message: "All fields are required" } };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return { error: { code: 400, message: "Invalid Credentials" } };
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return { error: { code: 400, message: "Invalid Credentials" } };
    }
    const { userId } = user.toObject();
    const token = createSecretToken(userId);
    return { token, userId };
  } catch (error) {
    console.error("Could not login user due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};
