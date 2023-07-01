import Lead from "../models/lead.js";

export const createLead = async (body) => {
  try {
    const { userId, name, email, phone, otherFields = null } = body;
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return { error: { code: 400, message: "Lead already exists" } };
    }
    const lead = await Lead.create({ userId, email, name, phone, otherFields });
    return { lead };
  } catch (error) {
    return { error: { code: 400, message: error.message } };
  }
};

export const getLeadsForUser = async (
  userId,
  page,
  pageSize,
  sortBy,
  sortOrder
) => {
  try {
    const pipeline = [
      { $match: { userId } },
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          paginatedData: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $project: { _id: 0 } },
          ],
          totalCountData: [
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
        },
      },
    ];

    const [result = []] = await Lead.aggregate(pipeline);
    const { paginatedData = [], totalCountData = [] } = result;
    const totalCount = totalCountData?.[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    return { leads: paginatedData, totalPages };
  } catch (error) {
    console.error("Could not get leads due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};
