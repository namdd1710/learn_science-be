
export const successResponse = (result) => {
  return {
    errorCode: 200,
    errorMessage: "success",
    result: result
  };
};

export const successPaginationResponse = (result, count, page, size,pageCount) => {
  return {
    errorCode: 200,
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
