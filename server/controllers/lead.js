import { getLeadsForUser } from "../services/lead.js";

export const getLeadsController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { leads = [], error = null } = await getLeadsForUser(userId);
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ success: false, message });
    }
    return res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error("Unable to get leads for user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to get leads for user", success: false });
  }
};
