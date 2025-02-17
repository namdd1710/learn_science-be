import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

export const checkAuthorization = (req, res, next) => {
  const authorization = req?.headers?.authorization;

  if (!authorization) {
    return res?.status(401).json(errorResponse(401, "Unauthorized", ""));
  }

  next();
};

export const CheckUserRolePermission = (role) => {
  return function (req, res, next) {
    const token = req?.headers?.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);
    if (decodedToken.roles.includes(role)) {
      next();
    } else {
      return res
        .status(403)
        .json(errorResponse({ status: 403, message: "Forbidden", data: "" }));
    }
  };
};
