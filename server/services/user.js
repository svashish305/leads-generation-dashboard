import User from "../models/user.js";

export const updateUser = async (userId, body) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ userId }, body, {
      new: true,
    });
    if (!updatedUser) {
      return { error: { code: 404, message: "User not found" } };
    }
    return { user: updatedUser };
  } catch (error) {
    console.error("Could not update user due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};
