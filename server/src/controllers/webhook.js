import { process } from "../services/webhook.js";

export const processWebhookController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { email, name, phone, otherFields } = req.body;
    const { success, message } = await process({
      userId,
      email,
      name,
      phone,
      otherFields,
    });
    if (success) {
      return res.status(200).json({ message, success });
    }
    return res.status(400).json({ message, success });
  } catch (error) {
    console.error("Unable to process webhook due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to process webhook", success: false });
  }
};
