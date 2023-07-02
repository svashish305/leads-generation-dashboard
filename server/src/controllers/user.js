import { updateUser } from "../services/user.js";

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

export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const body = req.body;
		if (req.user.userId !== parseInt(userId, 10)) {
			return res
				.status(401)
				.json({ message: "You are not authorized", success: false });
		}
    const { user = null, error = null } = await updateUser(userId, body);
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ message });
    }
    return res
      .status(200)
      .json({ message: "User updated", success: true, user });
  } catch (error) {
    console.error("Unable to update user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to update user", success: false });
  }
};
