import { _apiCode, _errors } from "../errors/errors.js";
import UsersModel from "../models/users.model.js";
import { ROLE_USER } from "../secure/roles.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const RegisterNewUser = async (req, res) => {
  const { name, email, phone, password, roles,userName, address } =
    req.body;

  try {
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { phone }, { userName }],
    });

    if (existingUser) {
      const response = errorResponse(_apiCode.ERR_DEFAULT, _errors.E001_002, null);
      return res.status(_apiCode.ERR_DEFAULT).json(response);
    }
    req.body.roles = [ROLE_USER]
    const newUser = new UsersModel(req.body);
    await newUser.save();
    const response = successResponse(null);
    res.status(_apiCode.SUCCESS).json(response);
  } catch (error) {
    const response = errorResponse(_apiCode.ERR_DEFAULT, error.message, error.message);
    res.status(_apiCode.ERR_DEFAULT).json(response);
  }
};


const filterOneUser = async(filter) => {
  try {
    const user = await UsersModel.findOne(filter);
    if (!user) {
      return res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, "User not found", null));
    }
    return user;
  } catch (error) {
    return res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
}

export const FindUserById = async (userId) => {
  ;
  try {
    const user = await UsersModel.findById(userId);
    if (!user) {
      return res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, "User not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(user));
  } catch (error) {
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminCreateNewUser = async (req, res) => {
  const { name, email, phone, password, roles,userName, address } =
    req.body;

  try {
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { phone }, { userName }],
    });

    if (existingUser) {
      const response = errorResponse(_apiCode.ERR_DEFAULT, _errors.E001_002, null);
      return res.json(response);
    }
    
    const newUser = new UsersModel(req.body);
    await newUser.save();
    const response = successResponse(null);
    res.status(_apiCode.SUCCESS).json(response);
  } catch (error) {
    const response = errorResponse(_apiCode.ERR_DEFAULT, error.message, error.message);    
    res.status(_apiCode.ERR_DEFAULT).json(response);
  }
};
