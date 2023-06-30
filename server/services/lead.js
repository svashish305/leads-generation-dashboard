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
      { $facet: {
          paginatedData: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $project: { _id: 0 } }
          ],
          totalCount: [
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } }
          ]
        }
      }
    ];

    const [result] = await Lead.aggregate(pipeline);
    const { paginatedData: leads, totalCount } = result;
    const totalPages = Math.ceil(totalCount[0].count / pageSize);
    return { leads, totalPages };
  } catch (error) {
    console.error("Could not get leads due to : ", error);
    return { error: { code: 500, message: error.message } };
  }
};
