import jwt from "jsonwebtoken";

export const getUserIdFromRequest = (req) => {
  const token = req?.headers?.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRETKEY);
  return decodedToken.userId;
};

export const getUserNameFromRequest = (req) => {
  const token = req?.headers?.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRETKEY);
  return decodedToken.userName;
};
