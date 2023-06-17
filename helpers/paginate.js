exports.getPaginatedRecords = async (
  model,
  {
    limit: specifiedLimit = 10,
    page,
    data = {},
    selectedFields,
    sortFilter = [["created_at", -1]],
    populate,
    populateObj,
    populateObj1,
    populateObj2,
  }
) => {
  try {
    const limit = Math.min(specifiedLimit, 100); // restrict limit to 100
    const offset = 0 + (Math.abs(page || 1) - 1) * limit;

    const modelData = await model.find({ ...data }).countDocuments();

    const result = await model
      .find({ ...data })
      .populate(populate? populate : "")
      .populate(populateObj?populateObj:"")
      .populate(populateObj?populateObj:"")
      .populate(populateObj1?populateObj1:"")
      .populate(populateObj2?populateObj2:"")
      .select(selectedFields ? selectedFields : "")
      .skip(offset)
      .limit(limit)
      .sort(sortFilter);
    
    const altNoResult = []
    return {
      data: (Number(modelData) > 0)?result: altNoResult,
      pagination: {
        pageSize: limit, //number of content yousee per page
        totalCount: modelData, //Total number of records
        pageCount: Math.ceil(modelData / limit), //How many pages will be available
        currentPage: +page, //if you're on page 1 or 18...
        hasNext: page * limit < modelData,
      },
    };
  } catch (err) {
    console.log(err);
  }
};
