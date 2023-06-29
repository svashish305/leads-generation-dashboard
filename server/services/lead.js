import Lead from "../models/lead.js";

export const createLead = async (body) => {
  try {
    const { userId, email, name, phone, otherFields } = body;
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return { error: { code: 400, message: "Lead already exists" } };
    }
    const lead = await Lead.create({ userId, email, name, phone, otherFields });
    return { lead };
  } catch (error) {
    console.error("Could not create lead due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};

export const getLeadsForUser = async (userId) => {
  try {
    let leads = await Lead.find({ userId });
    return { leads };
  } catch (error) {
    console.error("Could not get leads due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};
