import { signup, login } from "../services/auth.js";

export const signupController = async (req, res) => {
  try {
    const { token = null, user = null, error = null } = await signup(req.body);
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ message });
    }
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    const userResponse = {
      userId: user.userId,
      email: user.email,
    };
    return res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: userResponse,
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
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    return res
      .status(200)
      .json({ message: "User logged in successfully", success: true, userId });
  } catch (error) {
    console.error("Unable to login user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to login user", success: false });
  }
};

export const getUserController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({ message: "User found", success: true, user });
  } catch (error) {
    console.error("Unable to get user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to get user", success: false });
  }
};
