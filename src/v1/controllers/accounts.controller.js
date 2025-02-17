import { _errors } from "../errors/errors.js";
import UsersModel from "../models/users.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const RegisterNewUser = async (req, res) => {
  const { name, email, phone, password, roles,userName, address } =
    req.body;

  try {
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { phone }, { userName }],
    });

    if (existingUser) {
      const response = errorResponse(400, _errors.E001_002, null);
      return res.status(400).json(response);
    }
    const newUser = new UsersModel(req.body);
    await newUser.save();
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(500, error.message, error.message);
    res.status(500).json(response);
  }
};
