class DBUtil {
  constructor(model) {
    this.model = model;
  }

  search(queryStr) {
    const searchQuery = {};

    function createDateFilter(dateFilter) {
      let value = {};
      if (dateFilter.value.startDate === 'NA') value = { $eq: null };
      else {
        if (dateFilter.value.startDate) {
          value = Object.assign(value, { $gte: moment(dateFilter.value.startDate) });
        }
        if (dateFilter.value.endDate) {
          value = Object.assign(value, { $lte: moment(dateFilter.value.endDate) });
        }
      }
      return value;
    }

    for (const key in queryStr) {
      if (queryStr.hasOwnProperty(key)) {

        let value;
        const queryStrData = queryStr[key];
        if (Array.isArray(queryStrData.value)) { // multi select
          if (queryStrData.searchType === 'notContains') value = { $nin: queryStrData.value };
          else value = { $in: queryStrData.value };
        } else if (typeof (queryStrData) === 'object') { // for start date and end date
          if (queryStrData.type === 'date') {
            value = createDateFilter(queryStrData);
          } else if (queryStrData.type === 'text') {
            if (queryStrData.searchType === 'startsWith') value = { $regex: `^${queryStrData.value}`, $options: 'i' };
            else if (queryStrData.searchType === 'contains') value = { $regex: `${[queryStrData.value]}`, $options: 'i' };
            else if (queryStrData.searchType === 'range') {
              // if (queryStrData.value.startRange === 'NA') value = { $eq: null };
              // if (queryStrData.value.endRange === 'NA') value = { $eq: null };
              // else {
              if (queryStrData.value.startRange) {
                value = Object.assign(value, { $gte: moment(queryStrData.value.startRange) });
              }
              if (queryStrData.value.endRange) {
                value = Object.assign(value, { $lte: moment(queryStrData.value.endRange) });
              }
              // }
            }
            else value = { $eq: queryStrData.value };
          } else { // for single select dropdown
            value = { $eq: queryStrData.value };
          }
        } else {
          value = { $eq: queryStrData };
        }
      }
      searchQuery = { ...searchQuery, [key]: value };
    }
    return this.model.find(searchQuery);
  }

/*   filter(queryStr) {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  } */

  /*   pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    } */
}

module.exports = DBUtil;