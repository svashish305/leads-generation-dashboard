import { createLead, getLeadsForUser } from "../services/lead.js";

export const createLeadController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, phone, otherFields = null } = req.body;
    const { lead = null, error = null } = await createLead({
      userId,
      name,
      email,
      phone,
      otherFields,
    });
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ success: false, message });
    }
    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Unable to create lead due to : ", error);
    return res
      .status(400)
      .json({ message: "Unable to create lead", success: false });
  }
};

export const getLeadsController = async (req, res) => {
  try {
    const { userId } = req.user;
    let {
      page = 1,
      pageSize = 5,
      sortBy = "_id",
      sortOrder = "asc",
    } = req.query;
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);
    sortOrder = sortOrder === "asc" ? 1 : -1;
    const {
      leads = [],
      totalPages = 0,
      error = null,
    } = await getLeadsForUser(userId, page, pageSize, sortBy, sortOrder);
    if (error) {
      const { code, message } = error;
      return res.status(code).json({ success: false, message });
    }
    return res
      .status(200)
      .json({ success: true, leads, totalPages });
  } catch (error) {
    console.error("Unable to get leads for user due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to get leads for user", success: false });
  }
};
