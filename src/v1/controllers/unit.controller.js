import { _apiCode } from "../errors/errors.js";
import unitModel from "../models/unit.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const AddNewUnit = async (req, res) => {
  const {name} = req.body;
  try {
    const existingUnit = await findUnitByName(name);
    if (existingUnit) {
      return res.json(errorResponse(_apiCode.ERR_DEFAULT, "Unit already exists", null));
    }
    const newUnit = await unitModel.create(req.body);
    res.status(_apiCode.SUCCESS).json(successResponse(newUnit._id));
  } catch (error) {
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const findUnitByName = async (name) => {
  try {
    const unit = await unitModel.findOne({name});
    return unit;
  } catch (error) {
    throw new Error(`Error finding unit by name: ${error.message}`);
  }
};