import { createLead } from "./lead.js";
import { sendEventToClients } from "../utils/sse.js";

export const process = async (body) => {
  try {
    console.log("webhook payload ", body);
    // const { userId, email, name, phone, otherFields } = body;
    // const { lead, error } = await createLead({
    //   userId,
    //   email,
    //   name,
    //   phone,
    //   otherFields,
    // });
    // if (error) {
    //   return { success: false, message: error.message };
    // }

    // const leadData = JSON.stringify(lead);
    // sendEventToClients(leadData);

    return { success: true, message: "Webhook Processed" };
  } catch (error) {
    console.error("Unable to process webhook due to : ", error);
    return { success: false, message: "Unable to process webhook" };
  }
};
