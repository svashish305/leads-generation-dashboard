import { createLead } from "./lead.js";
import { eventEmitter } from "../utils/eventEmitter.js";

export const process = async (body) => {
  try {
    console.log("webhook payload ", body);
    const { userId, email, name, phone, otherFields } = body;
    const { lead, error } = await createLead({
      userId,
      email,
      name,
      phone,
      otherFields,
    });
    if (error) {
      return { success: false, message: error.message };
    }

    const eventData = {
      type: "lead",
      data: lead,
    };
    eventEmitter.emit("event", eventData);

    return { success: true, message: "Webhook Processed" };
  } catch (error) {
    console.error("Unable to process webhook due to : ", error);
    return { success: false, message: "Unable to process webhook" };
  }
};
