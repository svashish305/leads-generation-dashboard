import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const validateUser = async (req, res, next) => {
  const { userId = null } = req.params;
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Invalid User" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(401).json({ message: "Invalid token, user not found" });
    }
    if (userId && user.userId !== parseInt(userId, 10)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const { __v, password, ...others } = user.toObject();
    req.user = others;
    next();
  } catch (error) {
    console.error("Token Validation error:", error);
    return res.status(401).json({ message: "Invalid User" });
  }
};
