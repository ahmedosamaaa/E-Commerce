import { paginationFunction } from "./Pagination.js";

export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }

  //pagination
  pagination() {
    const { pageNumber, size } = this.queryData;
    const { limit, skip, page } = paginationFunction(pageNumber, size);
    this.mongooseQuery.limit(limit).skip(skip);
    this.page = page
    return this;
  }
  //sort
  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "));
    return this;
  }
  //select
  select() {
    this.mongooseQuery.select(this.queryData.select?.replaceAll(",", " "));
    return this;
  }
  //filter
  filter() {
    const queryObject = { ...this.queryData };
    let execludedQuery = ["sort", "pageNumber", "search", "select","size"];
    execludedQuery.forEach((ele) => {
      delete queryObject[ele];
    });
    const queryString = JSON.parse(
      JSON.stringify(queryObject).replace(
        /gt|gte|lt|lte|in|nin|eq|neq|regex/g,
        (match) => `$${match}`
      )
    );
    this.mongooseQuery.find(queryString);
    return this;
  }
}
