import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";
import { _apiCode } from "../errors/errors.js";

export const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errorResponse(_apiCode.ERR_DEFAULT, errors.array()[0].msg, errors.array()[0].msg));
    }
    next();
  };
};
