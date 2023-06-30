import { signup, login } from "../services/auth.js";

export const signupController = async (req, res) => {
  try {
    const {
      token = null,
      userId = null,
      error = null,
    } = await signup(req.body);
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ message });
    }
    return res.status(201).json({
      message: "User signed up successfully",
      success: true,
      userId,
      token,
    });
  } catch (error) {
    console.error("Unable to signup user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to signup user", success: false });
  }
};

export const loginController = async (req, res) => {
  try {
    const { token = null, userId = null, error = null } = await login(req.body);
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ message });
    }
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      userId,
      token,
    });
  } catch (error) {
    console.error("Unable to login user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to login user", success: false });
  }
};