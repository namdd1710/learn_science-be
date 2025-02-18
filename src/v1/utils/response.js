import { _apiCode } from "../errors/errors.js";

export const successResponse = (result) => {
  return {
    errorCode: _apiCode.SUCCESS,
    errorMessage: "success",
    result: result
  };
};

export const successPaginationResponse = (result, count, page, size,pageCount) => {
  return {
    errorCode: _apiCode.SUCCESS,
    errorMessage: "success",
    recordCount: count,
    pageCount: pageCount,
    currentPage: page,
    pageSize: size,
    records: result
  };
};

export const calculatePageCount = (count, size) => {
  return Math.ceil(count / size);
};

export const errorResponse = (errorCode, errorMessage, result) => {
  return {
    errorCode: errorCode,
    errorMessage: errorMessage,
    result: result
  };
};
